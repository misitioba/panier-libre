import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'
import authMixin from '../mixins/auth'

Vue.component('sidebar', {
    mixins: [stylesMixin, authMixin],
    props: ['logo'],
    template: styleMixinTmpl(`
    <div :class="sidebarClass" ref="root" >
        <div class="sidebar_menu" @mousemove="mousemove">
            
            <img class="logo" @click="$router.push({name:'home'})" :src="logo"/>

            <ul v-show="collapsed && isLogged">
                <li :class="linkSelected('dashboard')?'selected':''">
                    <button class="btn" @click="$router.push({name:'dashboard'})">Tableau de bord</button>
                </li>
                <li :class="linkSelected('baskets')?'selected':''">
                    <button class="btn" @click="$router.push({name:'baskets'})">Paniers</button>
                </li>                
                <li :class="linkSelected('clients')?'selected':''">
                    <button class="btn" @click="$router.push({name:'clients'})">Les clients</button>
                </li>
               
                <li :class="linkSelected('integration')?'selected':''">
                    <button class="btn" @click="$router.push({name:'integration'})">Intégration Web</button>
                </li>
                
                <li>
                <a class="btn" :href="'${window.cwd(
    'reserver'
  )}'+'?umid='+userModuleId" target="_blank">Ouvrez le formulaire de réservation</a>
            </li>
                
            <li>
                    <a class="btn" href="${window.cwd(
    'version'
  )}" target="_blank">Version du logiciel</a>
                </li>
                
            </ul>

            <div class="bottom" v-show="isLogged">
                <i @click="toggle(false)" v-show="collapsed" class="fas fa-angle-double-left toggle_btn"></i>
                <i @click="toggle(true)" v-show="!collapsed" class="fas fa-angle-double-right toggle_btn"></i>
            </div>

        </div>
        <div class="sidebar_slot" >
            <slot  ></slot>
        </div>
    </div>
    `),
    data() {
        return {
            styles: `
            .logo{
                cursor:pointer;
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
            .sidebar_menu button:hover,.sidebar_menu a:hover{
                color:#ffd15c;
            }
            .sidebar_menu button,.sidebar_menu a{
                width:100%;
                text-align:left;
                background: transparent;
                color: #f3705a;
            }
                .sidebar_slot{
                    overflow-y: auto;
                    max-height: calc(100vh - 36px);
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
                    background-color: #181721;
                    margin-top: -36px;
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
                .sidebar_menu li.selected{
                    background-color:#403838;
                }
            `,
            collapsed: false,
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
    created() {},
    methods: {
        mousemove() {
            if (window.innerWidth > 1024 && !this.collapsed) {
                this.toggle(true)
            }
        },
        toggle(value) {
            this.collapsed = value
            this.toggleColdown = Date.now() + 1000 * 20
        },
        linkSelected(name) {
            return this.$route.name == name
        }
    },
    async mounted() {
        this.resizeInterval = setInterval(() => {
            if (window.innerWidth < 992) {
                if (this.toggleColdown === null && this.collapsed) {
                    this.toggle(false)
                } else {
                    if (Date.now() > this.toggleColdown) {
                        this.toggle(false)
                    }
                }
            } else {
                if (this.toggleColdown === null && !this.collapsed) {
                    this.toggle(true)
                }
            }
        }, 1000)
        this.userModuleId = await api.funql({ name: 'getUserModuleId' })
    }
})