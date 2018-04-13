new Vue({
    el: "#share-file",
    data: {
        fileName: '',
        token: '',
        encrypt: false,
        url: '',
        shareTime: '',
        shareValid: '',
        pass: '',
        msg: '',
        msgShow: false,
        verifyCode: '',
        success: true,
        avatar: '',
        userName: '',
        usrPic: ''
    },
    created: function () {
        var vm = this;
        vm.token = (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization");
        axios.post('/file/shareDownload', Qs.stringify({'code': location.href.split("?")[1].split('=')[1]})).then(function (value) {
            console.log(value.data);
            if ('0000' == value.data.code) {
                vm.verifyCode = value.data.data.verifyCode;
                vm.fileName = value.data.data.fileName;
                if ('yes' == value.data.data.encrypt) {
                    vm.encrypt = true;
                } else {
                    vm.url = '/nginx/file/' + value.data.data.url + '?token=' + vm.token + '&verifyCode=' + vm.verifyCode;
                    vm.shareTime = value.data.data.time;
                    if (value.data.data.valid == null) {
                        vm.shareValid = "永久有效";
                    } else {
                        vm.shareValid = value.data.data.valid + "天内有效";
                    };
                    vm.avatar = value.data.data.avatar;
                    vm.userName = value.data.data.userName;
                }
            } else {
                vm.msg = value.data.msg;
                vm.success = false;
            }
        })

    },
    methods: {
        confirm: function () {
            var vm = this;
            vm.msgShow = false;
            axios.post('/file/shareDownload', Qs.stringify({
                'code': location.href.split("?")[1].split('=')[1],
                'pass': vm.pass
            })).then(function (value) {
                if ('0000' == value.data.code) {
                    vm.encrypt = false;
                    vm.verifyCode = value.data.data.verifyCode;
                    vm.fileName = value.data.data.fileName;
                    vm.url = '/nginx/file/' + value.data.data.url + '?token=' + vm.token + '&verifyCode=' + vm.verifyCode;
                    vm.shareTime = value.data.data.time;
                    if (value.data.data.valid == null) {
                        vm.shareValid = "永久有效";
                    } else {
                        vm.shareValid = value.data.data.valid + "天内有效";
                    };
                    vm.avatar = value.data.data.avatar;
                    vm.userName = value.data.data.userName;
                } else {
                    vm.msg = value.data.msg;
                    vm.msgShow = true;
                }
            })

        }
    }
});


axios.post('/user/userInfo').then(function (value) {
    if ((value.data.code != '0000')) {
        location.href = 'login.html';
    } else {
        $('#username').html(value.data.data.name);
        if (value.data.data.vip == '1') {
            $('#username').css("color", "orange");
        };
        var pic;
        if('' == value.data.data.pic){
            pic = 'img/usr/default.png';
        } else {
            pic = value.data.data.pic;
        }
        $('#usrpic').attr('src', pic);
    }
}).catch(function (reason) {
    location.href = 'login.html';
});

$(function () {
    $('#logout').click(function () {
        axios.get("/user/logout").then(function (value) {
            alert(value.data.msg);
            location.reload();
        });
    });
});