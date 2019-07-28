export default {
    name: 'ProgramationPage',
    props: [],
    template: `
        <div class="programation" ref="root" @keyup.enter="save" tabindex="0" @keyup.esc="$router.push('/')">
        <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
                <button class="btn" @click="addItem">Ajouter</button>
                <button class="btn" @click="()=>$router.push('/')">Retour</button>
                </div>
            <h2>Programmation</h2>
            <p>Le système déclenchera automatiquement la création de paniers basés sur la programmation active a 00hs chaque jour.</p>
            <p>
            Si vous venez d'éditer une règle de programmation pour aujourd'hui et que vous ne voulez pas attendre, cliquez sur le bouton Exécution manuelle.
            </p>
            <button class="btn" @click="execute">Exécution manuelle</button>
            <table-component ref="table" :gridColumns="gridColumns" :items="items" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" @clickRow="editRow"></table-component>

            
            
            <h2>Logs</h2>
            <button class="btn" @click="tables.logs.refresh">Refresh</button>
            <table-component ref="table" :gridColumns="tables.logs.gridColumns" :items="tables.logs.items" :colsTransforms="tables.logs.colsTransforms" :valueTransforms="tables.logs.valueTransforms" :cols="tables.logs.cols" @clickRow="tables.logs.click" ></table-component>
            
            
            

        </div>
    `,
    data() {
        var self = this

        function createEditFieldHandler({
            field,
            prefetch = null,
            component = 'textarea-cmp',
            created = () => {},
            save = null
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
                    cmp.$on('input', value => {
                        v[field] = value
                        if (save) {
                            let funqlParams = save(value, Object.assign({}, v))
                            if (funqlParams) {
                                api.funql(funqlParams)
                            }
                        }
                        self.$forceUpdate()
                    })
                }
            })
        }

        return {
            styles: `
            .basket_models{}
        `,

            tables: {
                logs: {
                    items: [],
                    gridColumns: '1fr',
                    cols: ['creation_date'],
                    colsTransforms: {
                        creation_date: v => `fait à`.toUpperCase()
                    },
                    valueTransforms: {
                        creation_date: v =>
                            moment(v.creation_date)
                            .utc()
                            .format('DD/MM/YYYY HH[h]mm')
                    },
                    async refresh() {
                        self.tables.logs.items = await api.funql({
                            name: 'getScheduleLogs',
                            args: [{
                                type: 'PROGRAMATION'
                            }]
                        })
                    },
                    click(id, item) {
                        console.log('SCHEDULE', id, 'RESULT:')
                        console.log(atob(item.result))
                    }
                }
            },

            form: {},
            items: [],
            gridColumns: '1fr 1fr 1fr 1fr 1fr',
            colsTransforms: {
                model_id: () => `Modèle de panier`.toUpperCase(),
                date: () => 'Date'.toUpperCase(),
                rule: () => 'quand'.toUpperCase(),
                action: () => ''
            },
            cols: ['model_id', 'date', 'rule', 'enabled','action'],
            valueTransforms: {
                model_id: createEditFieldHandler({
                    component: 'select-cmp',
                    field: 'model_id',
                    prefetch: {
                        name: 'getBasketModels'
                    },
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', {
                            selected: rowItem.model_id,
                            items: prefetchResult,
                            transform: v => ({ value: v.id, text: v.description })
                        })
                    },
                    save: (newValue, item) => {
                        return {
                            name: 'editProgramationField',
                            args: [{
                                field: 'model_id',
                                value: newValue,
                                id: item.id
                            }]
                        }
                    }
                }),
                date: createEditFieldHandler({
                    component: 'date-picker',
                    field: 'date',
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', {
                            selected: rowItem.date
                        })
                    },
                    save: (newValue, item) => {
                        return {
                            name: 'editProgramationField',
                            args: [{
                                field: 'date',
                                value: newValue,
                                id: item.id
                            }]
                        }
                    }
                }),
                rule: createEditFieldHandler({
                    component: 'select-cmp',
                    field: 'rule',
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', {
                            selected: rowItem.rule,
                            items: [
                                { value: 'EACH_WEEK', text: 'Chaque semaine' },
                                { value: 'EACH_MONTH', text: 'Chaque mois' },
                                { value: 'ONE_TIME', text: 'Une fois' }
                            ]
                        })
                    },
                    save: (newValue, item) => {
                        return {
                            name: 'editProgramationField',
                            args: [{
                                field: 'rule',
                                value: newValue,
                                id: item.id
                            }]
                        }
                    }
                }),
                enabled: createEditFieldHandler({
                    component: 'toggle-component',
                    field: 'enabled',
                    created(component, rowItem, prefetchResult) {
                        component.$emit('set', rowItem.enabled)
                    },
                    save: (newValue, item) => {
                        return {
                            name: 'editProgramationField',
                            args: [{
                                field: 'enabled',
                                value: newValue,
                                id: item.id
                            }]
                        }
                    }
                }),
                action: v => ({
                    component: 'button-cmp',
                    params: {},
                    mounted(cmp) {
                        cmp.$emit('set', {
                            text: 'Delete',
                            async handler() {
                                if (window.confirm('Sûre?')) {
                                    await window.api.funql({
                                        name: 'removeProgramation',
                                        args: [v.id]
                                    })
                                    self.refresh()
                                }
                            }
                        })
                    }
                })
            }
        }
    },
    computed: {},
    methods: {
        async execute() {
            await api.funql({
                name: 'baskets_execute_programations',
                args: []
            })
            this.refresh()
        },
        async addItem() {
            await api.funql({
                name: 'addProgramation',
                args: [{
                    creation_date: Date.now()
                }]
            })
            this.refresh()
        },
        editRow(id) {},
        async refresh() {
            this.items = await window.api.funql({
                name: 'getProgramations'
            })
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
        this.refresh()
    }
}