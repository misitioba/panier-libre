import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'
Vue.component('basket-list', {
    mixins: [stylesMixin],
    template: styleMixinTmpl(`
        <div class="basket_list" ref="root">
            <div class="btn_group">
                <button class="btn" @click="refresh">Refresh</button>
                <button class="btn" @click="addBasket">Ajouter panier</button>
            </div>
            <div class="filters">
            <div class="">
                <label>Voir les paniers archivés</label>
                <toggle-component ref="toggleArchived" @toggle="()=>showArchived=!showArchived"></toggle-component>
            </div>
            <div class="">
                <label>Ordre par</label>
                <select v-model="orderByField" class="select">
                    <option v-for="option in orderByList" v-bind:value="option.id" v-html="option.description">
                    </option>
                </select>
                <select  v-model="orderByFieldDirection" class="select dir">
                    <option v-for="option in ['ASC','DESC']" v-bind:value="option" v-html="option">
                    </option>
                </select>
            </div>
            </div>
            
            <table-component ref="table" :gridColumns="gridColumns" :items="filteredBaskets" :colsTransforms="colsTransforms" :valueTransforms="valueTransforms" :cols="cols" @clickRow="p=>$emit('editBasket', p)"></table-component>

        </div>
    `),
    data() {
        return {
            styles: `
            .basket_list .btn_group{
                margin-bottom:30px;
            }
            .basket_list .filters{
                display: grid;
                grid-template-columns: 1fr 1fr; 
            }
            select{
                margin-bottom:5px;
                max-width:150px;
            }
            select.dir{
                width:80px;
            }
            @media only screen and (max-width: 639px) {
                
            }
        `,
            baskets: [],
            gridColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
            colsTransforms: {
                delivery_date: () => 'Date de livraison'.toUpperCase(),
                creation_date: () => 'Date de création'.toUpperCase(),
                bookings: () => 'réservations'.toUpperCase(),
                available: () => 'disponible'.toUpperCase(),
                quantity: () => `quantité`.toUpperCase()
            },
            cols: [
                'creation_date',
                'title',
                'quantity',
                'bookings',
                'available',
                'delivery_date'
            ],
            valueTransforms: {
                delivery_date: v => moment(v.delivery_date).format('DD/MM/YYYY'),
                creation_date: v => moment(v.creation_date).format('DD/MM/YYYY')
            },
            showArchived: false,
            orderByList: [{
                    id: 'delivery_date',
                    description: 'Date de livraison'
                },
                {
                    id: 'creation_date',
                    description: 'Date de création'
                }
            ],
            orderByField: 'delivery_date',
            orderByFieldDirection: 'ASC'
        }
    },
    computed: {
        filteredBaskets() {
            var items = this.baskets.filter(b => {
                if (!this.showArchived && b.is_archived === 1) return false
                return true
            })
            items = items.map(item => {
                if (item.is_archived) {
                    item._rowClass = 'archived_row'
                }
                return item
            })
            items = items.sort((a, b) => {
                return a[this.orderByField] < b[this.orderByField] ? -1 : 1
            })
            if (this.orderByFieldDirection === 'DESC') {
                items = items.reverse()
            }
            if (this.$refs.table) {
                this.$refs.table.$emit('resetSorting')
            }
            return items
        }
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
                name: 'getBaskets'
            })
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
        this.refresh()
        this.$on('refresh', this.refresh)

        this.$refs.toggleArchived.$emit('set', false)
    }
})