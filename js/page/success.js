new Vue({
    el:'#app',
    data: {
        username: []
    },
    created: function () {
        var vm = this;
        axios.post('/user/username').then(function (value) {
            if(!(value.data == '')) {
                vm.username.push(value.data);
            }
        });
    }
})