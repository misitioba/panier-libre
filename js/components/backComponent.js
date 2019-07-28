const BackComponent = {
    template: `
        <div class="wrapper" ref="root">
            <div class="btn-group">
                <div class="box">
                    <router-link to="/">Retour au tableau de bord</router-link>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            styles: `
            .wrapper{
                margin: -20px -20px 50px -20px;
                display:flex;
                justify-content:center;
                align-items:center;
                background: linear-gradient( rgba(251, 216, 216, 0.37), rgba(0, 0, 0, 0.06)), url('/basket-hot/static/basket-bg.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                padding: 0px;
            }
            .btn-group{
                display: grid;
                    grid-template-columns: 100%;
                    grid-template-areas: 'el';
            }
            a{
                background-color: #f8e3e3d9;

                

                display: flex;

                justify-content: center;

                align-items: center;

                padding: 15px;

                margin: 10px;

                border-radius: 10px;
            
                text-decoration: none;

                font-size: 14px;

                color: #4061b3;

                white-space: nowrap;

                font-weight: bold;
            }
            @media only screen and (max-width: 639px) {
                a{
                    font-size:12px;
                }
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
Vue.component('back-component', BackComponent)