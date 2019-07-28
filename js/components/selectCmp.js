Vue.component('select-cmp', {
    template: `
    <select v-model="selected" class="select" @change="change">
        <option v-for="item in items" v-bind:value="transform(item).value" v-html="transform(item).text">
        </option>
    </select>`,
    data() {
        return {
            selected: '',
            items: [],
            meta: {},
            transform: item => ({ value: item.value, text: item.text })
        }
    },
    methods: {
        change() {
            this.$emit('selected', this.items.find(i => i.value == this.selected))
        }
    },
    created() {
        this.$on('set', v => {
            if (v.transform) {
                this.transform = v.transform
            }
            if (v.selected) {
                this.selected = v.selected
            }
            this.items = v.items
                // this.$forceUpdate()
        })
    },
    mounted() {
        this.$emit('mounted', this)
    }
})