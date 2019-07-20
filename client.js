/*
(()=>{
    //var URI = `https://savoie.misitioba.com`
    var URI = `http://localhost:3000`
    fetch(`${URI}/basket-hot/client`).then(t=>t.text()).then(script=>{
        eval(script)
        form.generate({
            el: 'body',
            prepend: true
        })
    })
})();

(()=>{
    var URI = 'https://savoie.misitioba.com'
    fetch(URI+'/basket-hot/client').then(t=>t.text()).then(script=>{
        eval(script)
        form.generate({
            el: 'body',
            prepend: true
        })
    })
})();
*/

var form = {}
form.styles = `
    @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
    .fnt1{
        font-family: 'Roboto', sans-serif;
    }
    .bhf{
        max-width: 340px;
        background-color: #fbf1f1;
        min-height: 240px;
        border-radius: 5px;
        margin: 10px auto;
        padding: 20px;
    }
    .bhf_frm_group{
        display: grid;
        grid-template-rows: 1fr 1fr;
    }
    .bhf_frm_group label{
        display:flex;
        align-items:center
    }
    .bhf_frm_group input{
        border: 0px;

height: 45px;

font-family: 'Roboto', sans-serif;

font-size: 14px;

font-weight: bold;
    }
`
form.generate = async options => {
    let root = document.querySelector(options.el)

    if (!options.submit) {
        options.submit = {
            url: `${URI}/funql`,
            text: 'Envoyer la réservation',
            handler: data => {
                if (!data.email) {
                    alert('Email requis')
                    return -1
                }
                data.date = Date.now()
                data.isCustomer = true
                return {
                    name: `saveBasketBooking`,
                    args: [data]
                }
            },
            success: res => {
                if (res.err) {
                    if (res.err === 'NOT_AVAILABLE') {
                        return alert(
                            `Le type de panier sélectionné pour la date sélectionnée est déjà réservé en totalité`
                        )
                    }

                    console.warn(res.err)
                    alert(
                        `En ce moment n'est pas possible de confirmer la réservation, s'il vous plaît essayez plus tard ou contactez-nous par email`
                    )
                } else {
                    alert('Merci, la réservation est confirmée!')
                }
            }
        }
    }

    if (!options.model) {
        options.model = [{
            title: 'Paniers entrants',
            name: 'basket_id',
            type: 'reference',
            funql: {
                url: `${URI}/funql`,
                name: 'getBaskets',
                args: () => { },
                transform: function (result) {
                    return result
                        .filter(r => {
                            if (r.is_archived) return false
                            if (!moment(r.delivery_date).isSameOrAfter(moment(), 'day')) {
                                return false
                            }
                            return true
                        })
                        .map(r => ({
                            id: r.id,
                            text: `${moment(r.delivery_date).format('DD/MM/YYYY')} ${
                                r.description
                                }`
                        }))
                }
            }
        },
        {
            title: 'Email',
            name: 'email',
            type: 'text'
        }
        ]
    }

    let formRoot = document.createElement('div')
    formRoot.className = 'bhf'

    let match = document.querySelector('.bhf')
    if (match) {
        root.removeChild(match)
    }

    var modelElementsToAdd = await Promise.all(
        options.model.map(item => {
            return addModelItem(item)
        })
    )

    async function addModelItem(item) {
        var supportedTypes = ['text', 'reference']

        if (!supportedTypes.includes(item.type)) {
            alert(`ERROR: model item ${item.name} has an invalid type: ${item.type}`)
            return
        }

        var title = document.createElement('label')
        title.innerHTML = item.title
        title.className = 'fnt1'

        var control = null
        if (item.type === 'text') {
            control = document.createElement('input')
        }

        if (item.type === 'reference') {
            control = document.createElement('select')
            var options = []
            if (item.funql) {
                options = await funql(item.funql.url, {
                    name: item.funql.name,
                    args: item.funql.args(),
                    transform: item.funql.transform
                })
            }
            control.innerHTML = options.map(
                option => `
                <option value="${option.id}">${option.text}</option>
            `
            )
        }

        control.id = `bhf_control_${item.name}`

        let group = document.createElement('div')
        group.className = 'bhf_frm_group'

        group.appendChild(title)
        group.appendChild(control)
        return group
    }

    modelElementsToAdd.forEach(el => {
        formRoot.appendChild(el)
    })

    // submit
    var submit = document.createElement('button')
    submit.innerHTML = options.submit.text
    submit.onclick = function () {
        var data = {}
        options.model.forEach(m => {
            let id = `bhf_control_${m.name}`
            let val = ''
            if (m.type === 'text') {
                val = document.querySelector(`#${id}`).value
            }
            if (m.type === 'reference') {
                val = document.querySelector(`#${id}`).value
            }
            data[m.name] = val
        })
        var params = options.submit.handler(data)
        if (params === -1) {
            return console.warn('submit failed due to validation')
        }
        if (!options.submit.success) {
            options.submit.success = r => console.info('submit success', r)
        }
        funql(options.submit.url, params).then(options.submit.success)
    }
    formRoot.appendChild(submit)

    let styles = document.createElement('style')
    styles.setAttribute('scoped', '')
    styles.innerHTML = form.styles
    formRoot.appendChild(styles)

    if (options.prepend && root.children.length > 0) {
        root.insertBefore(formRoot, root.children[0])
    } else {
        root.appendChild(formRoot)
    }

    async function funql(uri, p) {
        if (p.transform) {
            p.transform = btoa(p.transform.toString())
            p.transformEncoded = true
        }
        let body = btoa(JSON.stringify(p))
        try {
            let res = await fetch(uri + `?body=${body}`)
            res = await res.json()
            return res
        } catch (err) {
            return {
                err: err.stack || err || 'SERVER_ERROR'
            }
        }
    }
}