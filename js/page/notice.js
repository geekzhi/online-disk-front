new Vue({
    el: '#notice',
    data: {
        systemShow: true,
        friendShow: false,
        unreadFriendList: []
    },
    created: function () {
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
    },
    methods: {
        showFriend: function () {
            var vm = this;
            vm.friendShow = true;
            vm.systemShow = false;
            $('#sys-li').attr('class','');
            $('#fri-li').attr('class','am-active');
            vm.unreadFriendList = [];
            axios.get('/notice/friend').then(function (value) {
                if('0000' == value.data.code) {
                    if(null != value.data.data) {
                        for(var i =0; i < value.data.data.length; i++) {
                            vm.unreadFriendList.push(value.data.data[i]);
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
        },
        agree: function (id) {
            console.log(id);
            axios.get('/notice/friend/' + id + '/true').then(function (value) {
                console.log(value.data);
                if('0000' == value.data.code) {

                }
            })
        },
        disagree: function (id) {
            console.log(id);
            axios.get('/notice/friend/' + id + '/false').then(function (value) {
                console.log(value.data);
                if('0000' == value.data.code) {

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
});

