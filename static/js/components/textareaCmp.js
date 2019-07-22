Vue.component('textarea-cmp', {
    template: `
    <textarea v-model="content" @change="$emit('input',content)">
    </textarea>`,
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