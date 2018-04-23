new Vue({
    el: "#message",
    data: {
        friends: [],
        f:[],
        openMessage: false,
        messText: '',
        id: '',
        name: '',
        contents: [],
        dataMess: '',
        addFriendName: '',
        alertContent: ''
    },
    created: function () {
        var vm = this;
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
                vm.id = value.data.data.id;
                vm.name = value.data.data.name;
                sessionStorage.setItem("uName", vm.name);
                sessionStorage.setItem("uAvatar", pic);
                sessionStorage.setItem("uId", vm.id);
            }
        }).catch(function (reason) {
            location.href = 'login.html';
        });


        vm.friends = [];
        axios.post("/user/friends").then(function (value) {
            if('0000' == value.data.code) {
                for(var i = 0; i < value.data.data.length; i++) {
                    if(value.data.data[i].pic == '') {
                        value.data.data[i].pic = 'img/usr/default.png';
                    }
                    vm.friends.push(value.data.data[i]);
                }
            }
        });

        // var goEasy = new GoEasy({
        //     appkey: 'BC-32b77fa9021a4b7784c92c86f55a300b'
        // });
        //
        // goEasy.subscribe({
        //     channel: 'chat',
        //     onMessage: function(message){
        //         var conten = message.content;
        //         var ch = conten.split(' ');
        //         var send = ch[0].split('to')[0];
        //         var receive = ch[0].split('to')[1];
        //         var ss = {};
        //         ss.name = vm.f.name;
        //         ss.mess = ch[1];
        //         if(vm.id == receive) {
        //             // vm.contents.push(ss);
        //             vm.dataMess = vm.dataMess + "\n" + ss.name + ":" + ss.mess;
        //          }
        //     }
        // });
    },
    methods:{
        conversion: function () {

        },
        friend: function () {
            
        },
        showMess: function (index) {
            var vm = this;
            // vm.contents = [];
            vm.f = [];
            vm.openMessage = true;
            vm.f = vm.friends[index];
            sessionStorage.setItem('aimId', vm.f.id);
            sessionStorage.setItem('aimAvatar', vm.f.pic);
            // axios.post('/mess/getMess', Qs.stringify({"aimId":vm.f.id})).then(function (value) {
            //     if('0000' == value.data.code) {
            //         vm.dataMess  = value.data.data;
            //         console.log(vm.dataMess);
            //     }
            // });
            $('#f-text').attr('src',$('#f-text').attr('src'));
        },
        sendMess: function () {
            var vm = this;
            var co = vm.messText.replace(/\s+/g,"");
            var goEasy = new GoEasy({
                 appkey: 'BC-32b77fa9021a4b7784c92c86f55a300b'
            });
            axios.post("/mess/send", Qs.stringify({
                "aimId": vm.f.id,
                "mess": co
            })).then(function (value) {
                if('T001' == value.data.code) {
                    $('#send-text').attr("class","input-group has-error");
                    $('#content-alert').modal('open');
                } else if('0000' == value.data.code) {
                    goEasy.publish({
                        channel: 'chat',
                        message: vm.id + 'to' + vm.f.id + ' ' + co
                    });
                    $('#f-text').attr('src',$('#f-text').attr('src'));
                }
            });

            vm.messText = '';
        },
        scroll: function (me) {
            // var obj = document.getElementById("f-text");
            // obj.contentWindow.sc(me);
        },
        cancelDanger: function () {
            $('#send-text').attr("class","input-group");
        },
        addFriend: function () {
            $('#add-friend').modal('open');
        },
        confirmFriend: function () {
            var vm = this;
           axios.get('/user/addFriends', {params:{'name':vm.addFriendName}}).then(function (value) {
                if(value.data.code == '0000') {
                    vm.alertContent = '已发送好友请求';
                } else {
                    vm.alertContent = value.data.msg;
                }
                $('#friend-alert').modal('open');
           });
           vm.addFriendName = '';
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

    $('#mess').click(function () {
        $('#friend').attr("class", "");
        $('#mess').attr("class", "am-active");
    });

    $('#friend').click(function () {
        $('#mess').attr("class", "");
        $('#friend').attr("class", "am-active");
    });


});



