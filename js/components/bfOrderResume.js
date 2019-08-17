import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'
import moment from 'moment'

Vue.component('bf-order-resume', {
    props: ['value'],
    mixins: [stylesMixin],
    template: styleMixinTmpl(`
    <div class="root" ref="root" v-show="true">
        <div v-show="value.items.length===0">
            <p class="emptyText">Cliquez sur les paniers pour les ajouter à votre commande</p>
        </div>
        <div class="basket" v-for="(item, index) in value.items" :key="item.id" @click="$emit('select',item)">
            <div class="a1 removeButton">
                <button class="" @click="$emit('remove',item)">X</button>
            </div>
            <div class="a2 title" v-html="item.title">
                <div class="title" v-if="false" v-html="item.title"></div>
                <div class="description" v-if="false" v-html="item.description"></div>
            </div>
            <div class="a4">
                <input class="q" :value="item.quantity" @change="onQuantitychange($event,item)"/>
            </div>
            <div class="a3" >
                <p class="price" v-html="item.total+' €'">
                </p>
            </div>
        </div>
    </div>
    `),
    data() {
        return {
            styles: `
.root{
    display: grid;
    grid-template-columns: 100%;
    margin-top: 20px;
}
.basket{
    background-color:#d9aa4c;
    padding: 10px 20px;

border-radius: 5px;

margin: 0px 0px;
margin-bottom: 5px;

display: grid;
grid-template-columns: 1fr 100px 50px 50px;
grid-template-areas: 'a2 a4 a3 a1';
}

.title{
    font-size:18px;
    color:white;
    display: flex;
align-items: center;
}
.description{
    color:white;
    padding-top:10px;
    font-size: 16px;
}


.a1{
    grid-area: a1;
}
.a2{
    grid-area: a2;
}
.a3{
    grid-area: a3;
}
.a4{
    grid-area: a4;
    display: flex;

justify-content: center;

align-items: center;
}
.removeButton{
    display:flex;
    justify-content: center;
    align-items: center;
}
.price{
    color:white;
    text-align:right;
}
button{
    border: 0px;
    cursor: pointer;
    background-color: white;
    height: 30px;
    width: 30px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 16px;
}
.emptyText{
    color: gray;
font-size: 14px;
font-style: italic;
}
.q{
    width: 50px;
    text-align: center;
}

@media only screen and (max-width: 639px) {
        .basket{
            grid-template-columns: 50px 1fr 50px;
            grid-template-areas: 'a1 a2 a3' 'a4 a4 a4';
        }        
        .price{
            text-align:left;
            margin:5px auto;
        }
        .title{
            font-size:16px;
        }
        .description{
            font-size:10px;
            padding-top:5px;
        }
        
        .a4{
        justify-content: end;
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
        onQuantitychange(e, item) {
            let newValue = Object.assign({}, this.value)
            let match = newValue.items.find(i => i.id == item.id)
            match.quantity = e.target.value
            match.total = match.price * match.quantity
            this.$emit('input', newValue)
        }
    },
    created() {},
    mounted() {}
})