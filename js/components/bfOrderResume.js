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
                <button class="" @click="$emit('remove',item)">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAEXUlEQVR4nO2dT2gdRRjAf/N4hjSkIUQpoeYUQi05SCjqwUPB1EOl0kMJ9KZgC73ZS/FSKngS6SkEEREPvdhDD6UF/wRyEIqWQqshlkKV2lJBbIkhNmlJk2fGw6y8+Nzdt9mZfJP33vcLQ+Dtzn6zv0x2ZnfffmssFmXrqcRuQKegooVQ0UKoaCGqsRtgMF3ALuAl4GWgH78OsA4sAFeBWWDeYld92+mNjfiDE/wu8COwBtiAZQ0n+zjQH3M/LTaeaGAAOAcsBRbcWP4EpoDejhMN9AGfAk+3WPK/5THwIdAdS7T4YGgwVeAIMAF0CYXtAd4CDhpMlAlAjKADwKHktySDwBu4/yZxYsw6hoHxjGXrSfElbb8qwOvAELAYIMamiNGjj5Hem1eAM8BOi32mbAFeAGZI/4MN4w5b8ggPgs8BD0gfsO4Cg4HivIMbANPi3CbCoCjdow8nstP4xmL/CBTnMjCfsWwE2B8oTmHERBtMP/B2Rsxl4PNQsSx2HvgiY3EFOGEw3aHiFUGyR48DezKWzQC/Bo53AXcqnsY+4JXA8XIREW0wvcBrpB82ngBfA48Ch70HfJuxbDdwILnOIkLT6Z3B9ODmnj5Twb24Hp22jd9xM459BuMR4n9UgJ+BWkrcLtxUb9pg7pfc/jqu3YsW23xKWmAE/wD4C5lT5VYqa8B3wEihmVAB0b9tg53azmUi1PSup8A6nUxvkZX0DosQRUSHuPbQztSKrFRE9JxnQ9qZFdw0sikmGfCyV8AM4k6d+xsWPQu8V6Jxrcpp/tt7a8APwPe2wD3JpqIzK2KGgTulKrcmOyx2pWxlHQyFUNFCqGghVLQQMe4ZriZl4/y8CnST/Yev4aZSvnUqSR35/S57awZ3/63MtYFTbPgyC27nx4Cfcuq8D/Q11HkRuJFT5ywN31DCXaadLNlur9tfMUT3ZWxvKqdO6r1E4KOcOsMZdUZjiI5xjF7e5Od5y5ZK1Al9g6EQOhgKoaKFUNFCqGghVLQQKloIFS2EihZCRQuhooVQ0UKoaCFUtBAqWggVLYSKFkJFC6GihVDRQqhoIVS0ECpaCBUthIoWQkULoaKFUNFCqGghVLQQKloIFS2EihZCRQuhooXoRNEdk5t0MOPz3SXqPB84zpYR4znDjw3mM+oP7VRx6dEO5tSZNJhPqOcUreIefzvcpM4k9USDFVxi8JNlG+6DZjcojmY3aAV8X1rQKRRK55OHj2jxHMwRWcCzY/mIfkL+067thHcWYN9j9E3fBrQIs0Ts0TVc8tZ2P1avAtPEEm1d4tMZXBLXdmYWuG6LJHrNwffQcQv4ivbt1cvARaBsRt46PjkokpOdMeAa8ZOxhi5/A5cI9d6BIBtxuaF/2QZyQpYbwGgIP8FEJ7LfBK4Q/uVi0uUp8CXwaig3Flv+WkcjyauRhnC9+ygun38frXGav447Hs8B53Ep6x9azwFwI8FEK/m0Qm9rC1S0ECpaCBUtxD9DwzyeK3US/wAAAABJRU5ErkJggg==" style="max-width:100%">
                </button>
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
    created() { },
    mounted() { }
})