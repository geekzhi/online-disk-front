new Vue({
    el: '#notice',
    data: {
        systemShow: true,
        friendShow: false,
        receiveList: [],
        sendList: [],
        sysList: []
    },
    created: function () {
        var vm = this;
        axios.get("/notice/system").then(function (value) {
            vm.sysList = [];
            if('0000' == value.data.code) {
                if(null != value.data.data) {
                    for(var i =0; i < value.data.data.length; i++) {
                        vm.sysList.push(value.data.data[i]);
                    }
                };
            }
        });
        axios.post('/user/userInfo').then(function (value) {
            if ((value.data.code != '0000')) {
                location.href = 'login.html';
            } else {
                $('#username').html(value.data.data.name);
                if (value.data.data.vip == '1') {
                    $('#username').css("color", "orange");
                    $('#uvip').attr("src","../img/vip-on.png");
                } else {
                    $('#uvip').attr("src","../img/vip-off.png");
                };
                var pic;
                if('' == value.data.data.pic){
                    pic = 'img/usr/default.png';
                } else {
                    pic = value.data.data.pic;
                }
                $('#usrpic').attr('src', pic);
                if(value.data.data.notice == 0) {
                    $('#notice-tip').attr("class", "");
                } else {
                    $('#notice-tip').attr("class", "tip");
                }
            }
        }).catch(function (reason) {
            location.href = 'login.html';
        });

    },
    methods: {
        showFriend: function () {
            var vm = this;
            vm.friendShow = true;
            vm.systemShow = false;
            $('#sys-li').attr('class','');
            $('#fri-li').attr('class','am-active');
            vm.receiveList = [];
            vm.sendList = [];
            axios.get('/notice/friend').then(function (value) {
                if('0000' == value.data.code) {

                    if(null != value.data.receive) {
                        for(var i =0; i < value.data.receive.length; i++) {
                            vm.receiveList.push(value.data.receive[i]);
                        }
                    };
                    if(null != value.data.send) {
                        for(var i =0; i < value.data.send.length; i++) {
                            vm.sendList.push(value.data.send[i]);
                        }
                    }
                }
            })
        },
        showSystem: function () {
            var vm = this;
            vm.friendShow = false;
            vm.systemShow = true;
            $('#fri-li').attr('class','');
            $('#sys-li').attr('class','am-active');
            vm.sysList = [];
            axios.get("/notice/system").then(function (value) {
                vm.sysList = [];
                if('0000' == value.data.code) {
                    if(null != value.data.data) {
                        for(var i =0; i < value.data.data.length; i++) {
                            vm.sysList.push(value.data.data[i]);
                        }
                    };

                }
            })
        },
        agree: function (id) {
            axios.get('/notice/friend/' + id + '/true').then(function (value) {
                if('0000' == value.data.code) {
                    $('#agree-friend').modal('open');
                }
            })
        },
        disagree: function (id) {
            axios.get('/notice/friend/' + id + '/false').then(function (value) {
                if('0000' == value.data.code) {
                    location.reload();
                }
            })
        }
    }
});
$(function () {
    $('#logout').click(function () {
        axios.get("/user/logout").then(function (value) {
            alert(value.data.msg);
            location.reload();
        });
    });

    $('#u-notice').click(function () {
        axios.put("/user/readNotice");
    });

});

