Vue.component('date-picker', {
    template: `
    <div class="date_picker" ref="root">
        <input type="text"  ref="picker"  />
    </div>`,
    data() {
        return {
            selected: '',
            items: [],
            transform: item => ({ value: item.value, text: item.text })
        }
    },
    created() {
        this.$on('set', v => {
            if (v.selected) {
                this.picker.setMoment(moment(v.selected))
            }
        })
    },
    mounted() {
        let self = this
        this.picker = new Pikaday({
            field: this.$refs.picker,
            format: 'DD/MM/YYYY',
            onSelect: function() {
                self.$emit('input', this.getMoment()._d.getTime())
            }
        })

        this.$emit('mounted', this)
    }
})