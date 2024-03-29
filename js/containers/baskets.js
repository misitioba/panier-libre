export default {
    name: 'HomeComponent',
    template: `
    <div>
    <!--
        <nav-component :enabled="isNavEnabled"></nav-component>
        -->
        <basket-list v-show="isNavEnabled" @addBasket="addBasket" @editBasket="editBasket" ref="basketList"></basket-list>
        
        <modal-window ref="modal" v-show="!!modalCmp" v-model="modalCmp" :params="modalCmpParams" @close="closeModal"></modal-window>
    </div>
    `,
    data() {
        return {
            user: {
                id: null
            },
            modalCmp: '',
            modalCmpParams: {
                foo: 1
            }
        }
    },
    methods: {
        closeModal() {
            this.modalCmp = ''
            this.$refs.basketList.$emit('refresh')
        },
        addBasket() {
            this.modalCmpParams = {
                mode: 'create'
            }
            this.modalCmp = 'basket-details'
        },
        editBasket(id) {
            this.modalCmpParams = {
                id,
                title: 'Edition',
                mode: 'edit'
            }
            this.modalCmp = 'basket-details'
        }
    },
    computed: {
        isNavEnabled() {
            return (this.user && !!this.user.id) || false
        }
    },
    created() {
        if (window.user && window.user.id != this.user.id) {
            this.user.id = window.user.id
        }
        this.interval = setInterval(() => {
            if (window.user && window.user.id != this.user.id) {
                this.user.id = window.user.id
            }
        }, 500)
    },
    destroyed() {
        clearInterval(this.interval)
    }
}