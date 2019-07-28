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
                prefetchResult = await api.funql(prefetch)
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