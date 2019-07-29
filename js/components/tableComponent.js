const scopeCss = require('scope-css')
var uniqid = require('uniqid')

window.COL_TRANSFORM = {
    upperCaseTransform: () =>
        col
        .toUpperCase()
        .split('_')
        .join(' ')
}

Vue.component('table-component', {
    props: [
        'items',
        'colsTransforms',
        'valueTransforms',
        'cols',
        'gridColumns',
        'filters'
    ],
    template: `
        <div ref="scope">
        <div class="table_component" ref="root">
            <div class="" v-show="!!filters">
                <button @click="filtersState.show=true" v-show="!filtersState.show">Filters</button>
                <button @click="filtersState.show=false" v-show="filtersState.show">Hide Filters</button>
                <div v-show="filtersState.show">
                    <div class="filterRow" v-for="(col, index) in getCols" :key="col" v-show="!!filters[col]">
                        <label v-html="transformColumn(col)"></label>
                        <select v-model="filtersState[col]">
                            <option v-for="type in filters[col]" :value="type" v-html="type">
                            </option>
                        </select>
                        
                        <input  v-model="filtersValue[col]"  @keyup="filterChange" v-if="col.indexOf('date')===-1"/>
                        
                        <date-picker v-model="filtersValue[col]" v-if="col.indexOf('date')!==-1" @keyup="filterChange"></date-picker>
                        
                    </div>
                </div>
            </div>
            <div class="table">
                <div class="row header">
                    <div class="col" v-for="(col, index) in getCols" :key="col" @click="toggleSort(col)">
                        <span v-html="transformColumn(col)"></span>
                        <span>
                            <i v-show="sorts[col]==1" class="fas fa-sort-down"></i>
                            <i v-show="sorts[col]==-1" class="fas fa-sort-up"></i>
                        </span>
                    </div>
                </div>
                <div v-show="items.length===0">
                    <p class="empty_text"><span>Pas d'enregistrements :(</span></p>
                </div>
                <div v-for="(item, index) in filteredItems()" :class="getRowClass(item)"  :key="item.id" @click="$emit('clickRow', item.id, item)">
                    <div class="col" v-for="(col, index) in getCols" @click="cellClick($event,item,col)">
                        <span v-html="transformValue(item,col)" v-show="!isComponent(transformValue(item,col))"> </span>
                        <component v-show="isComponent(transformValue(item,col))""  v-bind:is="getComponentName(transformValue(item,col))" @mounted="p=>onColValueCmpMounted(transformValue(item,col),p)"></component>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .table_component .empty_text{
                text-align:center;
                

color: rgb(53, 153, 193);

font-style: oblique;

font-size: 12px;
            }
            .table_component .table{
                display: grid;
                grid-template-columns: 1fr;
                margin-top:10px;
            }
            .filterRow{
                padding:5px;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
            }
            .filterRow select{
                margin-right: 5px;
                width: auto !important;
            }
            .filterRow label{
                display: flex;
justify-content: center;
align-items: center;
            }
            .table_component .row{
                
                display: grid;
                grid-template-columns: ${
  this.gridColumns ? this.gridColumns : '60px 1fr 1fr'
};
                padding:5px;
            }
            .table_component .body_row{
                cursor:pointer;
            }
            .table_component input, .table_component select{
                width:100%;
            }
            .table_component .row.header{
                cursor:pointer;
                background-color:#975d50;
            }
            .table_component .row.header .col{
                padding: 15px 20px;
                font-size: 12px;
font-weight: bold;

	color: rgb(239, 243, 247);
            }
            .table_component .row .col{
                padding: 5px 20px;
            }
            @media only screen and (max-width: 639px) {
                
            }
        `,
            filtersState: {
                show: false
            },
            filtersValue: {},
            sorts: (() => {
                var r = {}
                this.cols.forEach(c => (r[c] = 0))
                return r
            })()
        }
    },
    computed: {
        getCols() {
            return (
                this.cols || (this.items.length > 0 && Object.keys(this.items[0])) || []
            )
        },

        sortedItems() {
            let col = Object.keys(this.sorts).find(col => this.sorts[col] !== 0)
            let dir = this.sorts[col]
            console.log('compute sortedItems', {
                col,
                dir
            })
            if (!col) {
                return this.items
            } else {
                console.log('sorted by', col, dir)
                let sorted = this.items.sort((a, b) => {
                    return a[col] > b[col] ? -1 : 1
                })
                if (dir == -1) {
                    sorted = sorted.reverse()
                }
                return sorted
            }
        }
    },
    methods: {
        filteredItems() {
            var items = this.sortedItems
            Object.keys(this.filters).forEach(key => {
                if (this.filtersState[key] === 'include' && !!this.filtersValue[key]) {
                    items = items.filter(i => {
                        let value = this.transformValue(i, key)
                        if (!value.toString()) {
                            return true
                        } else {
                            return value.toString().indexOf(this.filtersValue[key]) !== -1
                        }
                    })
                }

                /*
                                && !!this.filtersValue[key] && value.toString().length === 10 &&
                                    value.toString().split('/').length === 3 &&
                                    parseInt(this.filtersValue[key]).toString().length > 10
                                    */

                items = items.filter(i => {
                    let value = this.transformValue(i, key)

                    if (
                        ['gte', 'gt', 'lt', 'lte', 'equal'].includes(this.filtersState[key])
                    ) {
                        let symbols = {
                            gt: '>',
                            gte: '>=',
                            lt: '<',
                            lte: '<=',
                            equal: '=='
                        }
                        let mod = this.filtersState[key]
                        return eval(`i[key] ${symbols[mod]} this.filtersValue[key]`)
                    }

                    return true
                })
            })
            return items
        },
        filterChange() {
            this.$forceUpdate()
        },
        toggleSort(col) {
            if (this.sorts[col] === 0) {
                this.sorts[col] = 1
            } else {
                this.sorts[col] = this.sorts[col] * -1
            }

            Object.keys(this.sorts)
                .filter(c => c != col)
                .forEach(col => {
                    this.sorts[col] = 0
                })

            this.$forceUpdate()
        },
        cellClick(e, item, col) {
            if (this.isComponent(this.transformValue(item, col))) {
                e.stopPropagation()
            }
        },
        getRowClass(item) {
            return `row body_row ${item._rowClass || ''}`
        },
        onColValueCmpMounted(colValue, cmp) {
            colValue.mounted && colValue.mounted(cmp)
        },
        isComponent(colValue) {
            if (!colValue) return false
            return (
                typeof colValue === 'object' && typeof colValue.component === 'string'
            )
        },
        getComponentName(colValue) {
            if (!colValue) return ''
            return colValue.component
        },
        transformColumn(col) {
            let upperCaseTransform = () =>
                col
                .toUpperCase()
                .split('_')
                .join(' ')
            let transforms = this.colsTransforms || {}
            return transforms[col] ? transforms[col]() : upperCaseTransform()
        },
        transformValue(item, col) {
            let transforms = this.valueTransforms || {}
            return transforms[col] ? transforms[col](item) : item[col]
        },
        applyScopedStyles() {
            this.$refs.scope.id = `table_${uniqid()}`
            let styles = document.createElement('style')
            styles.setAttribute('scoped', '')
            styles.innerHTML = scopeCss(this.styles, `#${this.$refs.scope.id}`)
            this.$refs.root.appendChild(styles)
        }
    },
    created() {
        if (this.filters) {
            Object.keys(this.filters).forEach(k => {
                if (this.filters[k].length > 0) {
                    this.filtersState[k] = this.filters[k][0]
                }
            })

            this.$watch('filtersState', () => this.$forceUpdate(), { deep: true })
        }
    },
    mounted() {
        this.applyScopedStyles()

        this.cols.forEach(col => {
            this.sorts[col] = 0
        })

        this.$on('resetSorting', () => {
            Object.keys(this.sorts).forEach(col => {
                this.sorts[col] = 0
            })
            this.$forceUpdate()
        })
    }
})