export default {
    name: 'BasketModelsPage',
    props: [],
    template: `
        <div class="basket_models" ref="root" @keyup.enter="save" tabindex="0" @keyup.esc="$router.push('/')">
        <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
                <button class="btn" @click="addItem">Ajouter</button>
                <button class="btn" @click="()=>$router.push('/')">Retour</button>
                </div>
            <h2>Modèles de panier</h2>
            <p>Les modèles sans description seront cachés dans d'autres vues.</p>
            <table-component ref="table" :gridColumns="gridColumns" :items="items" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" @clickRow="editRow"></table-component>

        </div>
    `,
    data() {
        var self = this

        function createEditFieldHandler(fieldName, transformHandler = null) {
            return v => ({
                component: 'textarea-cmp',
                params: {},
                mounted(cmp) {
                    cmp.$emit('set', v[fieldName])
                    cmp.$on('input', value => {
                        v[fieldName] = value
                        api.funql({
                            name: 'editBasketModelField',
                            args: [{
                                field: 'description',
                                value: transformHandler ?
                                    transformHandler(v[fieldName]) :
                                    v[fieldName],
                                id: v.id
                            }]
                        })
                        self.$forceUpdate()
                    })
                }
            })
        }

        return {
            styles: `
            .basket_models{}
        `,
            form: {},
            items: [],
            gridColumns: '1fr 1fr 1fr 1fr',
            colsTransforms: {
                quantity: () => `quantité`.toUpperCase(),
                creation_date: () => 'Date de création'.toUpperCase(),
                action: () => ''
            },
            cols: ['description', 'quantity', 'priority', 'action'],
            valueTransforms: {
                creation_date: v => moment(v.creation_date).format('DD/MM/YYYY'),
                description: createEditFieldHandler('description'),
                quantity: createEditFieldHandler('quantity', v => parseInt(v)),
                priority: createEditFieldHandler('priority', v => parseInt(v)),
                action: v => ({
                    component: 'button-cmp',
                    params: {},
                    mounted(cmp) {
                        cmp.$emit('set', {
                            text: 'Delete',
                            async handler() {
                                if (window.confirm('Sûre?')) {
                                    await window.api.funql({
                                        name: 'removeBasketModel',
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
        async addItem() {
            await api.funql({
                name: 'addBasketModel',
                args: [{
                    creation_date: Date.now()
                }]
            })
            this.refresh()
        },
        editRow(id) {},
        async refresh() {
            this.items = await window.api.funql({
                name: 'getBasketModels'
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