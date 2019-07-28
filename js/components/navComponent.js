const NavComponent = {
    props: ['enabled'],
    template: `
        <div class="wrapper" ref="root">
            <div class="btn-group" v-show="enabled">
                <div class="box">
                    <router-link to="/configuration">Configuration</router-link>
                </div>
                <div class="box">
                    <router-link to="/viewer">Voir les paniers</router-link>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .wrapper{
                margin: -20px;
                display:flex;
                justify-content:center;
                align-items:center;
                background: linear-gradient( rgba(251, 216, 216, 0.37), rgba(0, 0, 0, 0.06)), url('/basket-hot/static/basket-bg.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                padding: 20px;
                min-height: calc(100vh - 140px);
            }
            .btn-group{
                display: grid;
                    grid-template-columns: 50% 50%;
                    grid-template-areas: 'el el';
            }
            @media only screen and (max-width: 639px) {
                .btn-group{
                    display: grid;
                    grid-template-columns: 100%;
                    grid-template-areas: 'el' 'el';
                }
            }
            a{
                background-color: #f8e3e3d9;

                min-height: 200px;

                display: flex;

                justify-content: center;

                align-items: center;

                padding: 20px;

                margin: 20px;

                border-radius: 20px;
           
                text-decoration: none;

                font-size: 20px;

                color: #4061b3;

                white-space: nowrap;

                font-weight: bold;
            }
        `
        }
    },
    mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
    }
}
Vue.component('nav-component', NavComponent)