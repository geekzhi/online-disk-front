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
        usrPic: '',
        id: '',
        follower: true,
        followShow: false,
        load: true
    },
    created: function () {
        var vm = this;
        vm.token = (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization");
        axios.post('/file/shareDownload', Qs.stringify({'code': location.href.split("?")[1].split('=')[1]})).then(function (value) {
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
                    vm.id = value.data.data.id;
                    if(value.data.data.self == 'false') {
                        vm.followShow = true;
                        if(value.data.data.follow == 'true') {
                            vm.follower = false;
                        }
                    } else {
                        vm.followShow = false;
                    }
                }
            } else {
                vm.msg = value.data.msg;
                vm.success = false;
            };
            vm.load = false;
        });

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
                    vm.id = value.data.data.id;
                    if(value.data.data.self == 'false') {
                        vm.followShow = true;
                        if(value.data.data.follow == 'true') {
                            vm.follower = false;
                        }
                    } else {
                        vm.followShow = false;
                    }
                } else {
                    vm.msg = value.data.msg;
                    vm.msgShow = true;
                }
            })

        },
        follow: function () {
            var vm = this;
            axios.post('/user/follow/' + vm.id).then(function (value) {
                if('0000' == value.data.code){
                    vm.follower = false;
                } else {
                    vm.follower = true;
                }
            });
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
    $('.already-follow').hover(function () {
        $('.already-follow').html('取消关注');
        $('.already-follow').attr('class','am-btn am-btn-secondary am-round already-follow');
    },function () {
        $('.already-follow').html('已关注');
        $('.already-follow').attr('class','am-btn am-btn-default am-round already-follow');
    });
});