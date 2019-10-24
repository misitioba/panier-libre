export default {
    data() {
        return {
            _authMixinInterval: null,
            isLogged: false
        }
    },
    destroyed() {
        clearInterval(this._authMixinInterval)
    },
    methods: {
        checkIsLogged() {
            if (window.user && window.user.id) {
                this.isLogged = true
            } else {
                this.isLogged = false
            }
        }
    },
    created() {
        if (this.user && window.user && window.user.id != this.user.id) {
            this.user.id = window.user.id
        }
        this.checkIsLogged()
        this._authMixinInterval = setInterval(() => {
            this.checkIsLogged()
        }, 500)
    }
}