let cacheResult = {}
let cacheTimeout = {}

export default function createEditableColumn({
    field,
    prefetch = null,
    component = 'textarea-cmp',
    created = () => {},
    save = null,
    saveSuccess = () => {}
}) {
    return v => ({
        component: component,
        params: {},
        async mounted(cmp) {
            let prefetchResult = null
            if (prefetch) {
                if (prefetch.cache) {
                    var terminateCache = () => {
                        if (cacheTimeout[prefetch.name]) {
                            clearTimeout(cacheTimeout[prefetch.name])
                            cacheTimeout[prefetch.name] = null
                        }
                        cacheTimeout[prefetch.name] = setTimeout(() => {
                            delete cacheResult[prefetch.name]
                            console.log('CACHE TERMINATED:', prefetch.name)
                        }, prefetch.cache)
                    }
                    var waitCache = (success, timeout, start = Date.now()) => {
                        return new Promise(async(resolve, reject) => {
                            waitCacheLoop()

                            async function waitCacheLoop() {
                                if (Date.now() - start > 1000 * 5) {
                                    await timeout()
                                    resolve()
                                } else {
                                    if (cacheResult[prefetch.name] !== 'loading') {
                                        success(cacheResult[prefetch.name])
                                        resolve()
                                    } else {
                                        setTimeout(() => waitCacheLoop(), 50)
                                    }
                                }
                            }
                        })
                    }
                    if (cacheResult[prefetch.name] === 'loading') {
                        await waitCache(
                            cachedResult => {
                                prefetchResult = cachedResult
                                terminateCache()
                            },
                            async() => {
                                prefetchResult = await api.funql(prefetch)
                            }
                        )
                    } else {
                        cacheResult[prefetch.name] = 'loading'
                        prefetchResult = await api.funql(prefetch)
                        cacheResult[prefetch.name] = prefetchResult
                        terminateCache()
                    }
                } else {
                    prefetchResult = await api.funql(prefetch)
                }
            }

            created(cmp, v, prefetchResult || null)
            cmp.$on('input', async value => {
                v[field] = value
                trySave(value)
            })
            cmp.$on('selected', async value => {
                v[field] = value.selected
                trySave(value)
            })

            async function trySave(value) {
                if (save) {
                    let funqlParams = save(value, v) // Object.assign({}, v)
                    if (funqlParams) {
                        let r = await api.funql(funqlParams)
                        saveSuccess(r)
                    }
                }
            }
        }
    })
}