import stylesMixin from '../mixins/styles'
import authMixin from '../mixins/auth'

Vue.component('sidebar', {
    mixins: [stylesMixin, authMixin],
    props: ['logo'],
    template: `
    <div ref="scope">
    <div :class="sidebarClass" ref="root" v-show="isLogged">
        <div class="sidebar_menu">
            <img class="logo" :src="logo"/>
            <ul v-show="collapsed && isLogged">
                <li>
                    <button class="btn" @click="$router.push({name:'dashboard'})">Tableau de bord</button>
                </li>
                <li>
                    <button class="btn" @click="$router.push({name:'baskets'})">Paniers</button>
                </li>                
                <li>
                    <button class="btn" @click="$router.push({name:'clients'})">Les clients</button>
                </li>
               
                <li>
                    <button class="btn" @click="$router.push({name:'integration'})">Intégration Web</button>
                </li>
                <li>
                <a class="btn" :href="'${window.cwd(
        'reserver'
    )}'+'?umid='+userModuleId" target="_blank">Reserver</a>
            </li>
                
                
            </ul>

            <div class="bottom">
            <i @click="toggle(false)" v-show="collapsed" class="fas fa-angle-double-left toggle_btn"></i>
            <i @click="toggle(true)" v-show="!collapsed" class="fas fa-angle-double-right toggle_btn"></i>
            </div>

        </div>
        <div class="sidebar_slot" v-show="isLogged">
            <slot  ></slot>
        </div>
    </div>
    </div>
    `,
    data() {
        return {
            styles: `
            .logo{
                max-width: 100px;
max-height: 150px;
margin: 0px auto;
    margin-top: 0px;
margin-top: 10px;
display: block;
width: 100%;
            }
            .bottom{
                position:absolute;
                bottom:5px;
                width:100%;
            }
            button{
                width:100%;
                text-align:left;
            }
                .sidebar_slot{
                    overflow-y: auto;
                    max-height: calc(100vh - 35px);
                }
                ul{
                    list-style: none;
                    padding: 20px;
                }
                .sidebar li{
                    margin-bottom:20px;
                }
                .sidebar{
                    display: grid;
                    grid-template-columns: 50px 1fr;
                    grid-template-areas: 'sidebar content';
                    
                }
                .sidebar_menu{
                    position: relative;
                    width: auto;
                    height: calc(100vh);
                    background-color: #b5a075;
                    margin-top: -35px;
                    grid-area: 'sidebar'
                }
                .sidebar.collapsed{
                    grid-template-columns: 230px 1fr;
                }
                .sidebar .toggle_btn{
                    cursor:pointer;
                    font-size:30px;
                    color:white;
                    text-align: center;
                    margin:20px auto;
                    display:block;
                }
            `,
            collapsed: true,
            userModuleId: '',
            resizeInterval: null,
            toggleColdown: null
        }
    },
    destroyed() {
        clearInterval(this.resizeInterval)
    },
    computed: {
        sidebarClass() {
            return `sidebar ${this.collapsed ? 'collapsed' : ''}`
        }
    },
    created() { },
    methods: {
        toggle(value) {
            this.collapsed = value
            this.toggleColdown = Date.now() + 1000 * 20
        }
    },
    async mounted() {
        this.resizeInterval = setInterval(() => {
            if (window.innerWidth < 768) {
                if (this.toggleColdown === null && this.collapsed) {
                    this.toggle(false)
                } else {
                    if (Date.now() > this.toggleColdown) {
                        this.toggle(false)
                    }
                }
            } else {

            }
        }, 1000)
        this.userModuleId = await api.funql({ name: 'getUserModuleId' })
    }
})