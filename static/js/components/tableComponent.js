window.COL_TRANSFORM = {
    upperCaseTransform: () => col.toUpperCase().split('_').join(' ')
}

Vue.component('table-component', {
    props: ['items', 'colsTransforms', 'valueTransforms', 'cols'],
    template: `
        <div class="table_component" ref="root">
            <div class="table">
                <div class="row header">
                    <div class="col" v-for="(col, index) in getCols" :key="col">
                        <span v-html="transformColumn(col)"></span>
                    </div>
                </div>
                <div class="row" v-for="(item, index) in items" :key="item.id" @click="$emit('clickRow', item.id)">
                    <div class="col" v-for="(col, index) in getCols">
                        <span v-html="transformValue(item,col)"> </span>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .table{
                display: grid;
                grid-template-columns: 1fr;
                margin-top:10px;
            }
            .row{
                display: grid;
                grid-template-columns: 60px 1fr 1fr;
                /*grid-template-areas: '1 2 3';*/
            }
            .row.header{
                background-color:#08394d;
            }
            .row.header .col{
                padding: 15px 20px;
                font-size: 12px;
font-weight: bold;
font-family:GT Eesti Display, "Helvetica Neue", Helvetica, sans-serif;
	color: rgb(239, 243, 247);
            }
            .row .col{
                padding: 5px 20px;
            }
            @media only screen and (max-width: 639px) {
                
            }
        `
        }
    },
    computed: {
        getCols() {
            return this.cols || this.items.length > 0 && Object.keys(this.items[0]) || []
        }
    },
    methods: {
        transformColumn(col) {
            let upperCaseTransform = () => col.toUpperCase().split('_').join(' ')
            let transforms = this.colsTransforms || {}
            return transforms[col] && transforms[col]() || upperCaseTransform()
        },
        transformValue(item, col) {
            let transforms = this.valueTransforms || {}
            return transforms[col] && transforms[col](item) || item[col]
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
    }
})