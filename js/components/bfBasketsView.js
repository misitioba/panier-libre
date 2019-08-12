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
        <p class="emptyText">Cliquez sur les paniers pour les ajouter à votre commande</p>
        <div class="basketsWrapper">
        <div class="basket" v-for="(item, index) in baskets" :key="item.id" @click="$emit('select',item)">
            <div class="title" v-html="item.title"></div>
            <div readonly class="description" v-html="itemDescription(item)"></div>
            <div>
                <span class="date">Sera livré le jour</span>
                <span class="date" v-html="date(item.delivery_date)"></span>
                <p v-html="item.price+' €'">
                </p>
            </div>
            
        </div>
        </div>
    </div>
    `),
    data() {
        return {
            styles: `
            .icon{

            }
.basketsWrapper{
    display: grid;
    grid-template-columns: 100%;
    padding: 10px 0px;
}
.basket{
    color:white;
    position:relative;
    background-color:#b5a075;
    padding:20px;
    border-radius:5px;
    margin:5px 0px;
    cursor:pointer;
    margin-right: 5px;

    background: linear-gradient(
        rgba(113, 134, 43, 0.95), rgba(113, 134, 43, 0.95) 
             ),url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMzIDMzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMyAzMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI3LjA0OSwzMC4xMzRINS45NTFjLTAuOTksMC0xLjgxLTAuNzQzLTEuOTA4LTEuNzI4TDIuNjU5LDE0LjUzN2MtMC4wMTQtMC4xNDEsMC4wMzItMC4yODEsMC4xMjctMC4zODUgICAgYzAuMDk1LTAuMTA1LDAuMjI5LTAuMTY1LDAuMzcxLTAuMTY1aDI2LjY4OGMwLjE0MSwwLDAuMjc2LDAuMDYsMC4zNzEsMC4xNjVjMC4wOTUsMC4xMDQsMC4xNDEsMC4yNDUsMC4xMjcsMC4zODVsLTEuMzgzLDEzLjg2OSAgICBDMjguODYsMjkuMzkxLDI4LjAzOSwzMC4xMzQsMjcuMDQ5LDMwLjEzNHogTTMuNzA4LDE0Ljk4OGwxLjMyOSwxMy4zMTljMC4wNDcsMC40NzIsMC40MzksMC44MjcsMC45MTMsMC44MjdoMjEuMDk5ICAgIGMwLjQ3NCwwLDAuODY3LTAuMzU1LDAuOTE0LTAuODI3bDEuMzI5LTEzLjMxOUgzLjcwOHoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8Zz4KCQkJPGc+CgkJCQk8cGF0aCBkPSJNNy42MDQsOS4xMDZjLTAuMTQzLDAtMC4yODUtMC4wNjEtMC4zODMtMC4xNzlDNy4wNDIsOC43MTYsNy4wNyw4LjQsNy4yODIsOC4yMjNsNi4yNDYtNS4yNCAgICAgIGMwLjIxMy0wLjE3NywwLjUyOC0wLjE1LDAuNzA0LDAuMDYyYzAuMTc4LDAuMjExLDAuMTUsMC41MjctMC4wNjIsMC43MDRsLTYuMjQ2LDUuMjRDNy44MzEsOS4wNjcsNy43MTcsOS4xMDYsNy42MDQsOS4xMDZ6IiBmaWxsPSIjMDAwMDAwIi8+CgkJCTwvZz4KCQkJPGc+CgkJCQk8cGF0aCBkPSJNMjUuMzk3LDkuMTA2Yy0wLjExMywwLTAuMjI3LTAuMDM5LTAuMzIxLTAuMTE3bC02LjI0Ny01LjI0Yy0wLjIxMS0wLjE3OC0wLjIzOS0wLjQ5My0wLjA2Mi0wLjcwNSAgICAgIGMwLjE3OS0wLjIxMSwwLjQ5My0wLjIzOSwwLjcwNS0wLjA2Mmw2LjI0Nyw1LjI0YzAuMjExLDAuMTc4LDAuMjM5LDAuNDkzLDAuMDYyLDAuNzA1QzI1LjY4Miw5LjA0NSwyNS41NCw5LjEwNiwyNS4zOTcsOS4xMDZ6IiBmaWxsPSIjMDAwMDAwIi8+CgkJCTwvZz4KCQk8L2c+CgkJPHBhdGggZD0iTTMxLjI3NSwxNC45ODhIMS43MjVDMC43NzQsMTQuOTg4LDAsMTQuMjE0LDAsMTMuMjYzdi0zLjE5OGMwLTAuOTUxLDAuNzc0LTEuNzI1LDEuNzI1LTEuNzI1aDI5LjU1ICAgIGMwLjk1MSwwLDEuNzI1LDAuNzc0LDEuNzI1LDEuNzI1djMuMTk4QzMzLDE0LjIxNCwzMi4yMjcsMTQuOTg4LDMxLjI3NSwxNC45ODh6IE0xLjcyNSw5LjMzOUMxLjMyNSw5LjMzOSwxLDkuNjY0LDEsMTAuMDY0djMuMTk4ICAgIGMwLDAuNCwwLjMyNSwwLjcyNSwwLjcyNSwwLjcyNWgyOS41NWMwLjM5OSwwLDAuNzI1LTAuMzI1LDAuNzI1LTAuNzI1di0zLjE5OGMwLTAuNC0wLjMyNS0wLjcyNS0wLjcyNS0wLjcyNUgxLjcyNXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGQ9Ik05LjI1NSwyNi4wNDhjLTAuMjc2LDAtMC41LTAuMjI0LTAuNS0wLjV2LTcuMjVjMC0wLjI3NiwwLjIyNC0wLjUsMC41LTAuNXMwLjUsMC4yMjQsMC41LDAuNXY3LjI1ICAgIEM5Ljc1NSwyNS44MjUsOS41MzIsMjYuMDQ4LDkuMjU1LDI2LjA0OHoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMTQuMDg1LDI2LjA0OGMtMC4yNzYsMC0wLjUtMC4yMjQtMC41LTAuNXYtNy4yNWMwLTAuMjc2LDAuMjI0LTAuNSwwLjUtMC41czAuNSwwLjIyNCwwLjUsMC41djcuMjUgICAgQzE0LjU4NSwyNS44MjUsMTQuMzYyLDI2LjA0OCwxNC4wODUsMjYuMDQ4eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0xOC45MTUsMjYuMDQ4Yy0wLjI3NiwwLTAuNS0wLjIyNC0wLjUtMC41di03LjI1YzAtMC4yNzYsMC4yMjQtMC41LDAuNS0wLjVzMC41LDAuMjI0LDAuNSwwLjV2Ny4yNSAgICBDMTkuNDE1LDI1LjgyNSwxOS4xOTEsMjYuMDQ4LDE4LjkxNSwyNi4wNDh6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTIzLjc0NSwyNi4wNDhjLTAuMjc2LDAtMC41LTAuMjI0LTAuNS0wLjV2LTcuMjVjMC0wLjI3NiwwLjIyNC0wLjUsMC41LTAuNXMwLjUsMC4yMjQsMC41LDAuNXY3LjI1ICAgIEMyNC4yNDUsMjUuODI1LDI0LjAyMSwyNi4wNDgsMjMuNzQ1LDI2LjA0OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    background-size: contain;

background-position: center;

background-repeat: no-repeat;

border: 3px solid #b5a074;
box-shadow: 0px 3px 5px #bca982;
}
.basket:hover{
    background-color:#86b048;
}
.emptyText{
    color: gray;

    font-size: 16px;
    
    font-style: italic;
    
    margin-bottom: 0px;
}
.title{
    font-size:25px;
    color:white;
}
.description{
    cursor:pointer;
    color:white;
    padding-top: 20px;
    font-size: 16px;
    border: 0px;
    background: transparent;
    width: 100%;
    padding: 10px 0px;
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
    .basketsWrapper{
        grid-template-columns: 33% 33% 33%;
    }
}
            `
        }
    },
    computed: {},
    methods: {
        itemDescription(item) {
            return item.description.split(/\r?\n/).join(', ')
        },
        date(d) {
            return moment(d).format('DD/MM/YYYY')
        }
    },
    created() {},
    mounted() {}
})