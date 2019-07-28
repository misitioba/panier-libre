import stylesMixin from '../mixins/styles'

Vue.component('booking-form', {
    props: [],
    mixins: [stylesMixin],
    template: `
    <div ref="scope">
        <div class="booking_form" ref="root" v-show="true">
            <h1>BOOKING FORM</h1>
            <ul>
                <li v-for="(item, index) in baskets" :key="item.id" v-html="item.title">
                </li>
            </ul>
        </div>
    </div>
    `,
    data() {
        return {
            styles: `
            
            `,
            baskets: []
        }
    },
    computed: {},
    methods: {
        async fetchBaskets() {
            this.baskets = (await api.funql({
                name: 'getBaskets'
            })).data
        }
    },
    created() {},
    mounted() {
        this.fetchBaskets()
    }
})