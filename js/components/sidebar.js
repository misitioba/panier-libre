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
                    <button class="btn" @click="$router.push('/')">Tableau de bord</button>
                </li>
                <li>
                    <button class="btn" @click="$router.push('/paniers')">Paniers</button>
                </li>
                <li>
                <button class="btn" @click="$router.push('/orders')">Commandes</button>
            </li>
                <li v-if="false">
                    <button class="btn" @click="$router.push('/programation')">Programmation</button>
                </li>
                
                <li>
                    <button class="btn" @click="$router.push('clients-list')">Nos clients</button>
                </li>
                <!--
                <li>
                    <button class="btn" @click="$router.push('basket-models')">Modèles de panier</button>
                <li>
                <li>
                    <button class="btn" @click="$router.push('book-basket')">Réservation manuelle</button>
                </li>
                -->
                <li>
                    <a class="btn" href="${window.cwd(
    'reserver'
  )}" target="_blank">Reserver</a>
                </li>
                <li>
                    <button class="btn" @click="$router.push('form-integration')">Intégration Web</button>
                </li>

                
                
            </ul>

            <div class="bottom">
            <i @click="collapsed = !collapsed" v-show="collapsed" class="fas fa-angle-double-left toggle_btn"></i>
            <i @click="collapsed = !collapsed" v-show="!collapsed" class="fas fa-angle-double-right toggle_btn"></i>
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
                    max-height: calc(100vh - 100px);
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
                    position:relative;
                    width:auto;
                    height:calc(100vh);
                    background-color:#b5a075;
                    margin-top:-100px;
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
            collapsed: true
        }
    },
    computed: {
        sidebarClass() {
            return `sidebar ${this.collapsed ? 'collapsed' : ''}`
        }
    },
    created() {},
    mounted() {}
})