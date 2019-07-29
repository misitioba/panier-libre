import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/styles'

Vue.component('date-picker', {
    mixins: [stylesMixin],
    props: ['value'],
    template: styleMixinTmpl(`
    <div class="date_picker" ref="root">
        <input type="text" placeholder="DD/MM/YYYY"  ref="picker"  />
        <button class="btn" @click="clear">R</button>
    </div>`),
    data() {
        return {
            styles: `
                .date_picker{
                    display:flex;
                }
                input{
                    margin-right:5px;
                }
                button{
                    width: 50px !important;
text-align: center !important;
                }
            `,
            selected: '',
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
    methods: {
        clear() {
            this.$refs.picker.value = ''
            this.$emit('input', '')
            this.$emit('keyup', '')
        }
    },
    mounted() {
        let self = this
        this.picker = new Pikaday({
            field: this.$refs.picker,
            format: 'DD/MM/YYYY',
            onSelect: function() {
                self.$emit('input', this.getMoment()._d.getTime())
                self.$emit('keyup', this.getMoment()._d.getTime())
            }
        })
        if (this.value) {
            this.picker.setMoment(moment(this.value))
        }
        this.$emit('mounted', this)
    }
})