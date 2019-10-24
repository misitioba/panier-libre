import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'
import authMixin from '../mixins/auth'
export default {
    mixins: [stylesMixin, authMixin],
    name: 'Home',
    template: styleMixinTmpl(`
    <div ref="root">
    <h2>Bienvenue, vous êtes dans l'instance {{currentInstanceTitle}}</h2>
    <h4>{{currentInstance.title}}</h4>
    <a class="InstanceLink" :href="currentInstance.url" target="_blank" v-html="currentInstance.url"></a>
    <div class="btn_group" style="margin-top:10px;">
        <router-link class="btn" :to="{name:'dashboard'}">Aller au tableau de bord</router-link>
    </div>
    <h3>Autres serveurs</h3>
    <ul>
        <li v-for="item in otherInstances">
            <h4>{{item.title}}</h4>
            <a class="InstanceLink" :href="item.url" target="_blank" v-html="item.url"></a>
        </li>
    </ul>
    <h3>Créez votre propre instance</h3>
    <p>Suivez les instructions pour intégrer une nouvelle instance de serveur dans l'écosystème.</p>
    <a href="https://gitlab.com/misitioba/panier-libre/tree/master" target="_blank">
    https://gitlab.com/misitioba/panier-libre/tree/master
    </a>
    </div>
    `),
    data() {
        return {
            styles: `
            .InstanceLink{
                font-size:10px;
            }
            @media only screen and (max-width: 639px) {
                
            }
            @media only screen and (max-width: 1047px) {
                
            }
            @media only screen and (min-width: 1048px) {
                
            }
        `
        }
    },
    methods: {},
    computed: {
        currentInstanceTitle() {
            let match = this.instances.find(
                item => item.url.indexOf(window.location.origin) !== -1
            )
            if (match) {
                return match.title
            } else {
                return `${window.location.origin} (Non-officiel)`
            }
        },
        currentInstance() {
            let match = this.instances.find(
                item => item.url.indexOf(window.location.origin) !== -1
            )
            if (match) {
                return match
            } else {
                return {}
            }
        },
        otherInstances() {
            return this.instances.filter(item => item.url != this.currentInstance.url)
        },
        instances() {
            if (window.location.origin.indexOf('localhost') !== -1) {
                if (!window.instances.find(i => i.url == window.location.origin)) {
                    window.instances.unshift({
                        title: 'Localhost',
                        url: window.location.origin
                    })
                }
            }
            return window.instances
        }
    },
    created() {},
    destroyed() {}
}