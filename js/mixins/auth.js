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
    created() {
        if (this.user && window.user && window.user.id != this.user.id) {
            this.user.id = window.user.id
        }
        this._authMixinInterval = setInterval(() => {
            if (window.user && window.user.id) {
                this.isLogged = true
            } else {
                this.isLogged = false
            }
        }, 500)
    }
}