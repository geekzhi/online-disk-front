new Vue({
    el: "#pic",
    data: {
        picList: []
    },
    created: function () {
        var vm = this;
        axios.get('/file/fileList/image').then(function (value) {
            if (!(value.data == '')) {
                for (var i = 0; i < value.data.data.length; i++) {
                    vm.picList.push(value.data.data[i]);
                }
            }
        });
    }
});