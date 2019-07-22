Vue.component('button-cmp', {
    template: `
    <button class="btn" v-html="text" @click="handler()">
    </button>`,
    data() {
        return {
            text: '',
            handler: () => {}
        }
    },
    created() {
        this.$on('set', v => {
            this.text = v.text
            this.handler = v.handler
        })
    },
    mounted() {
        this.$emit('mounted', this)
    }
})