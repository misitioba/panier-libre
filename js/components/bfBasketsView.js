import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'
import moment from 'moment'

Vue.component('bf-baskets-view', {
    props: ['baskets'],
    mixins: [stylesMixin],
    template: styleMixinTmpl(`
    <div class="root" ref="root" v-show="true">
        <div class="basket" v-for="(item, index) in baskets" :key="item.id" @click="$emit('select',item)">
            <div class="title" v-html="item.title"></div>
            <textarea readonly class="description" v-html="item.description"></textarea>
            <div>
                <span class="date">Sera livré le jour</span>
                <span class="date" v-html="date(item.delivery_date)"></span>
            </div>
        </div>
    </div>
    `),
    data() {
        return {
            styles: `
.root{
    display: grid;
    grid-template-columns: 50% 50%;
}
.basket{
    background-color:#b5a075;
    padding:20px;
    border-radius:5px;
    margin:20px 0px;
    cursor:pointer;
    margin-right: 5px;
}
.basket:hover{
    background-color:#86b048;
}
.title{
    font-size:25px;
    color:white;
}
.description{
    cursor:pointer;
    color:white;
    padding-top: 20px;
    font-size: 14px;
    border: 0px;
    background: transparent;
    width: 100%;
    min-height: 150px;
    resize: none;
}
.date{
    color:white;
}
@media only screen and (max-width: 639px) {
    .root{
        display: grid;
        grid-template-columns: 100%;
    }
    .description{
        min-height:80px;
        padding-top:5px;
    }
    .basket{
        margin-right:0px;
        margin:5px auto;
        padding:10px;
        margin-bottom:10px;
    }
}
@media only screen and (max-width: 1047px) {

}
@media only screen and (min-width: 1048px) {

}
            `
        }
    },
    computed: {},
    methods: {
        date(d) {
            return moment(d).format('DD/MM/YYYY')
        }
    },
    created() {},
    mounted() {}
})