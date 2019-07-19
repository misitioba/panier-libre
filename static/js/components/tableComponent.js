window.COL_TRANSFORM = {
    upperCaseTransform: () =>
        col
        .toUpperCase()
        .split('_')
        .join(' ')
}

Vue.component('table-component', {
    props: ['items', 'colsTransforms', 'valueTransforms', 'cols', 'gridColumns'],
    template: `
        <div class="table_component" ref="root">
            <div class="table">
                <div class="row header">
                    <div class="col" v-for="(col, index) in getCols" :key="col">
                        <span v-html="transformColumn(col)"></span>
                    </div>
                </div>
                <div v-show="items.length===0">
                    <p class="empty_text"><span>Pas d'enregistrements :(</span></p>
                </div>
                <div v-for="(item, index) in items" :class="getRowClass(item)"  :key="item.id" @click="$emit('clickRow', item.id, item)">
                    <div class="col" v-for="(col, index) in getCols" @click="cellClick($event,item,col)">
                        <span v-html="transformValue(item,col)" v-show="!isComponent(transformValue(item,col))"> </span>
                        <component v-show="isComponent(transformValue(item,col))""  v-bind:is="getComponentName(transformValue(item,col))" @mounted="p=>onColValueCmpMounted(transformValue(item,col),p)"></component>
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
            .table_component .row{
                display: grid;
                grid-template-columns: ${
  this.gridColumns ? this.gridColumns : '60px 1fr 1fr'
};
                padding:5px;
            }
            .table_component .row.header{
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
        `
        }
    },
    computed: {
        getCols() {
            return (
                this.cols || (this.items.length > 0 && Object.keys(this.items[0])) || []
            )
        }
    },
    methods: {
        cellClick(e, item, col) {
            if (this.isComponent(this.transformValue(item, col))) {
                e.stopPropagation()
            }
        },
        getRowClass(item) {
            return `row ${item._rowClass || ''}`
        },
        onColValueCmpMounted(colValue, cmp) {
            colValue.mounted && colValue.mounted(cmp)
        },
        isComponent(colValue) {
            return (
                typeof colValue === 'object' && typeof colValue.component === 'string'
            )
        },
        getComponentName(colValue) {
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
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
    }
})