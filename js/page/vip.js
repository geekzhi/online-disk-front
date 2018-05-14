new Vue({
    el: "#vip",
    data: {
        h:'324324',
        token: '',
        payAlert: '',
        vip:'',
        vipDate: ''
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
                    $('#uvip').attr("src","../img/vip-on.png");
                    vm.vip = true;
                    vm.vipDate = value.data.data.vipExpiration;
                } else {
                    $('#uvip').attr("src","../img/vip-off.png");
                }
                ;
                if(value.data.data.notice == 0) {
                    $('#notice-tip').attr("class", "");
                } else {
                    $('#notice-tip').attr("class", "tip");
                }
                var pic;
                if ('' == value.data.data.pic) {
                    pic = 'img/usr/default.png';
                } else {
                    pic = value.data.data.pic;
                }
                $('#usrpic').attr('src', pic);
                vm.token = (sessionStorage.getItem("Authorization") == null)?localStorage.getItem("Authorization"):sessionStorage.getItem("Authorization");
            }
        }).catch(function (reason) {
            location.href = 'login.html';
        });
    },
    methods: {
        picClick: function (event) {
            var vm = this;
            var x = event.offsetX / $('#p').width();
            var y = event.offsetY / $('#p').height();
            console.log(x);
            console.log(y);
            if(x > 0.06 && x < 0.27 && y > 0.71 && y < 0.84) {
              // window.open("/pay/vip?token=" + vm.token);
                $('#vip-modal').modal('open');
            }
        },
        dealVip: function () {
            window.open("/pay/vip?time="+ $('#time-select').val() +"&token=" + this.token);
            $('#alert-modal').modal('open');
        },
        confirmPay: function () {
            var vm = this;
            axios.get("/pay/info").then(function (value) {
                if('0000' == value.data.code) {
                    vm.payAlert = '支付成功,3秒后跳回主页';
                } else {
                    vm.payAlert = '支付未完成,3秒后跳回主页';
                }
                $('#jump-modal').modal('open');
                setTimeout(function (args) {
                    location.href="my.html"
                }, 3000);

            })
        },
        expand: function (num) {
            window.open("/pay/expand?num="+ num +"&token=" + this.token);
            $('#alert-modal').modal('open');
        }
    }
})

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
