const formatFileName = require('../functions/common').formatFileName
const formatByte = require('../functions/common').formatByte

exports.create = function(aria2) {
    Vue.component('pause-list', {
        template: '#pauseList',
        props: ['nav'],
        data: function() {
            return {
                list: []
            }
        },
        filters: {
            fileName: formatFileName,
            speed: function(value) {
                if (value > 1024 * 1024) {
                    return (value / 1024 / 1024).toFixed(2) + 'MB/s'
                } else {
                    return (value / 1024).toFixed(2) + 'KB/s'
                }
            },
            byte: formatByte
        },
        methods: {
            checkAllToggle: (evt) => {
                let checked = evt.target.checked
                let listCheckbox = document.querySelectorAll('.active-list tbody input[type="checkbox"]')
                for (let i = 0; i < listCheckbox.length; i++) {
                    listCheckbox[i].checked = checked
                }
            },
            changeAllStatus: (evt) => {
                let checked = evt.target.checked
                if (!checked) {
                    document.querySelector('.active-list thead input[type="checkbox"]').checked = false
                }
            }
        },
        mounted: function() {
            const _this = this
            const upList = () => {
                aria2.send('tellWaiting', 0, 10).then(m => {
                    _this.list = m
                    for (let i = 0; i < _this.list.length; i++) {
                        let vs = _this.list[i]
                            //aria2.send('unpause', vs.gid).then(m => { aria2.send('pause', vs.gid).then(m => { console.log(123) }) })
                        percent = (vs['completedLength'] / vs['totalLength']).toFixed(3) * 100
                        _this.list[i].style = 'background: linear-gradient(to right,#ABF2F2 ' + percent + '%, #fff ' + percent + '%)'
                    }
                }, err => {
                    console.log(err)
                })
            }
            upList()
            setInterval(upList, 2000)
        }
    })
}