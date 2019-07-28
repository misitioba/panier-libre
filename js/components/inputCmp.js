Vue.component('input-cmp', {
    template: `
    <input v-model="content" @change="$emit('input',content)"/>`,
    data() {
        return {
            content: ''
        }
    },
    created() {
        this.$on('set', v => (this.content = v))
    },
    mounted() {
        this.$emit('mounted', this)
    }
})