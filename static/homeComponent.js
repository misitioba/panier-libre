const HomeComponent = {
    name: 'HomeComponent',
    template: `
    <div>
        <nav-component :enabled="isNavEnabled"></nav-component>
    </div>
    `,
    data() {
        return {
            user: {
                id: null
            }
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
        }, 500);
    },
    destroyed() {
        clearInterval(this.interval);
    }
}