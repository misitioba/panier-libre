import html2canvas from 'html2canvas'
import exportCSV from '../utils/exportCSV'

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
        'exportCSV',
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
            <div class="" v-if="!!filters">
                
            <button class="btn btn-small" @click="filtersState.show=true" v-show="!filtersState.show"><i class="fas fa-filter"></i> Montrer</button>
            <button class="btn btn-small" @click="filtersState.show=false" v-show="filtersState.show"><i class="fas fa-filter"></i> Cacher</button>
            
                <button class="btn btn-small" v-if="false" @click="exportJPG"><i class="fas fa-file-image"></i> Export JPG</button>
                <button class="btn btn-small" v-show="!!exportCSV" @click="exportCSVMethod"><i class="fas fa-file-csv"></i> Export CSV</button>

                
                <div v-show="filtersState.show">
                    <div class="filterRow" v-for="(col, index) in getFilterCols" :key="col" v-show="!!filters[col]">
                        <label v-html="transformColumn(col)"></label>
                        <select v-model="filtersState[col]" @change="filterChange">
                            <option v-for="type in getFilterTypes(col)" :value="type" v-html="type">
                            </option>
                        </select>
                        
                        <input  v-model="filtersValue[col]"  @keyup="filterChange" v-if="col.indexOf('date')===-1 && filtersState[col]!=='boolean'"/>

                        <toggle-component v-show="filtersState[col]=='boolean'"
                        v-model="filtersValue[col]"></toggle-component>
                        
                        <date-picker v-model="filtersValue[col]" v-if="col.indexOf('date')!==-1" @keyup="filterChange"></date-picker>
                        
                    </div>
                </div>
            </div>
            <div class="table" ref="table">
                <div class="row header">
                    <div class="col" v-for="(col, index) in getCols" :key="col" @click="toggleSort(col)">
                        <span v-html="transformColumn(col)"></span>
                        <span>
                            <i v-show="sorts[col]==1" class="fas fa-sort-alpha-down"></i>
                            <i v-show="sorts[col]==-1" class="fas fa-sort-alpha-up"></i>
                        </span>
                    </div>
                </div>
                <div v-show="items.length===0">
                    <p class="empty_text"><span>Pas d'enregistrements :(</span></p>
                </div>
                <div v-for="(item, index) in filteredItems()" :class="getRowClass(item)"  :key="item.id" @click="onRowClick(item)">
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
                background-color: #b5a075;
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
        getFilterCols(){
            if(this.items.length===0) return this.getCols
            else {
                let cols = Object.keys(this.items[0])
                let newCols = Object.keys(this.filters).filter(c=>{
                    return !cols.find(cc=>cc==c)
                })
                return cols.concat(newCols)
            }
        },
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
        exportCSVMethod() {
            let data = this.filteredItems()
            data = data.map(item => {
                let rta = {}
                rta.id = item.id
                this.getCols.forEach(col => {
                    if (this.isComponent(this.transformValue(item, col))) {
                        rta[col] = item[col]
                    } else {
                        rta[col] = this.transformValue(item, col)
                    }
                })
                rta._data = Object.assign({},item)
                return rta
            })
            let result = this.exportCSV(data, this)
            exportCSV(result.data, result.filename, result.headers)
        },
        exportJPG() {
            html2canvas(this.$refs.table).then(function(canvas) {
                var uri = canvas.toDataURL('image/jpg')
                let date = require('moment-timezone')()
                    .tz('Europe/Paris')
                    .format('DD-MM-YYYY-[a]-HH-mm')
                downloadURI(uri, `basket-hot-commandes-${date}`)
            })

            function downloadURI(uri, name) {
                var link = document.createElement('a')
                link.download = name
                link.href = uri
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        },
        onRowClick(item) {
            this.$emit('clickRow', item.id, item)
            this.$emit('rowClick', item.id, item)
        },
        filteredItems() {
            var items = this.sortedItems
            if (!this.filters) return items
            
            Object.keys(this.filters).forEach(key => {
                
                if (this.filtersState[key] === 'boolean'){
                    items = items.filter(i=>i[key] == this.filtersValue[key])
                }
                
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

                items = items.filter(i => {
                    let value = this.transformValue(i, key)

                    if (
                        this.filtersValue[key] !== '' &&
                        !!this.filtersValue[key] && ['gte', 'gt', 'lt', 'lte', 'equal'].includes(this.filtersState[key])
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
        getFilterTypes(filterKey){
            if(!this.filters[filterKey]) return false
            if(this.filters[filterKey] instanceof Array){
                return this.filters[filterKey]
            }else{
                return this.filters[filterKey].types || ['equal','include']
            }
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