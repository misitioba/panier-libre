function convertToCSV(objArray) {
    var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
    var str = ''

    for (var i = 0; i < array.length; i++) {
        var line = ''
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index]
        }

        str += line + '\r\n'
    }

    return str
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers)
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items)

    var csv = convertToCSV(jsonObject)

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv'

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae)
    } else {
        var link = document.createElement('a')
        if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', exportedFilenmae)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }
}

export default function(
    itemsNotFormatted = [],
    fileTitle = 'noname',
    headers = null
) {
    if (!headers) {
        headers = {}
        Object.keys(itemsNotFormatted[0]).forEach(key => {
            if (key.indexOf('_') === 0) return
            headers[key] = key
        })
    }

    var itemsFormatted = []

    itemsNotFormatted
        .filter(item => !!item)
        .forEach(item => {
            let _item = {}
            Object.keys(item).forEach((k, index) => {
                if (k.indexOf('_') === 0) return
                item[k] = item[k] || ''
                item[k] = item[k].toString()
                _item[k] = item[k].replace(/,/g, '')
                console.log(index, 'added', k, _item[k])
            })
            itemsFormatted.push(_item)
        })

    if (itemsFormatted.length === 0) {
        return console.warn('exportCSV: nothing no export')
    }

    exportCSVFile(headers, itemsFormatted, fileTitle)
}