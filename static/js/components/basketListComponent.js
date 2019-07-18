Vue.component('basket-list', {
    template: `
        <div class="BasketListComponent" ref="root">
            <button class="btn" @click="addBasket">Ajouter panier</button>
            <button class="btn" @click="refresh">Refresh</button>
           
            
            <table-component :items="baskets" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" @clickRow="p=>$emit('editBasket', p)"></table-component>

        </div>
    `,
    data() {
        return {
            styles: `
            
            @media only screen and (max-width: 639px) {
                
            }
        `,
            baskets: [],
            colsTransforms: {

            },
            cols: ['id', 'description', 'delivery_date'],
            valueTransforms: {
                delivery_date: v => moment(v).format('DD/MM/YYYY')
            }
        }
    },
    computed: {

    },
    methods: {
        refresh() {
            this.fetchBaskets()
        },
        addBasket() {
            this.$emit('addBasket')
        },
        async fetchBaskets() {
            this.baskets = await window.api.funql({
                name: "getBaskets"
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
})