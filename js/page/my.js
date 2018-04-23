new Vue({
    el: "#main",
    data: {
        fileList: [],
        nowType: '',
        nowPage: 0,
        totalPage: 0,
        token: '',
        shareUrl: '',
        sharePass: '',
        shareMsg: '',
        usrPic: '',
        usrName: '',
        usrEmail: '',
        changeAlert: '',
        newName: '',
        newPass: '',
        repeatNewPass: '',
        oldPass: '',
        newEmail: '',
        newEmailVerify: '',
        emailWrong: false,
        isTrash: false,
        trashAlert: '',
        trashAll: false

    },
    created: function () {
        var vm = this;
        vm.token = (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization");
        axios.post('/user/userInfo').then(function (value) {
            if (value.data.code == '0000'){
                if(value.data.data.pic == '' ) {
                   vm.usrPic = 'img/usr/default.png';
                } else {
                    vm.usrPic = value.data.data.pic;
                };
                vm.usrName = value.data.data.name;
                vm.usrEmail = value.data.data.email;
            } ;
        });
    },
    methods: {
        getFileList: function (type) {
            var vm = this;
            if('trash' == type) {
                vm.isTrash = true;
            } else {
                vm.isTrash = false;
            }
            axios.get('/file/fileList/' + type + '/1').then(function (value) {
                vm.fileList = [];
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        vm.fileList.push(value.data.data[i]);
                    }
                    vm.nowType = type;
                    vm.nowPage = 1;
                    vm.totalPage = value.data.page;
                }
            });
        },
        getFileListByPage: function (index) {
            var vm = this;
            vm.nowPage = vm.getPage(index);
            axios.get('/file/fileList/' + vm.nowType + '/' + vm.nowPage).then(function (value) {
                vm.fileList = [];
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        vm.fileList.push(value.data.data[i]);
                    }
                }
            });

        },
        getPage: function (page) {
            if (page < 1) {
                return 1;
            } else {
                if (page > this.totalPage) {
                    return this.totalPage;
                } else {
                    return page;
                }
            }
        },
        pagePre: function () {
            this.getFileListByPage(this.nowPage - 1);
        },
        pageNext: function () {
            this.getFileListByPage(this.nowPage + 1);
        },
        video: function (id) {
            var vm = this;
            sessionStorage.setItem("videopath", '/nginx/file/' + id + '?token=' + vm.token);
            window.open("video_player.html");
        },
        createUrl: function () {
            var id = sessionStorage.getItem("file-share");
            var shareTime = $('#shareTime').val();
            var shareType = $("input[name='share-type']:checked").val();
            var vm = this;
            if('' == shareType || '' == shareTime){
                alert("请选择");
            }else{
                if('forever' == shareTime) {vm.shareMsg = '链接永久有效'};
                if('seven' == shareTime) {vm.shareMsg = '链接7天后失效'};
                if('one' == shareTime) {vm.shareMsg = '链接1天后失效'};
            axios.post('/file/share', Qs.stringify({'id':id, 'shareTime':shareTime, 'shareType':shareType})).then(function (value) {
                if('0000' == value.data.code) {
                    if('' == value.data.data.pass){
                     vm.shareUrl = value.data.data.url;
                    } else{
                        vm.shareUrl = value.data.data.url;
                        vm.sharePass = '提取密码：' + value.data.data.pass;
                    }
                }
            });
            };
            $('#confirm-link').modal('open');
        },
        change: function (type) {
            var vm = this;
            if('name' == type) {
               $('#change-uname').modal('open');
            } else if ('email' == type) {
                vm.emailWrong = false;
                $('#change-email').modal({closeOnConfirm :false});
            } else if ('pass' == type) {
                $('#change-pass').modal('open');
            }
        },
        confirmChange: function(type) {
            var vm = this;
            if('name' == type) {
                axios.put('/user/name/' + vm.newName).then(function (value) {
                        vm.changeAlert = value.data.msg;
                        $('#change-alert').modal('open');
                })
            } else if ('pass' == type){
                if(vm.newPass != vm.repeatNewPass) {
                    vm.changeAlert = '两次输入密码不一致';
                    $('#change-alert').modal('open');
                } else {
                    axios.put('/user/pass/' + vm.oldPass + '/' + vm.newPass).then(function (value) {
                        vm.changeAlert = value.data.msg;
                        $('#change-alert').modal('open');
                    })
                }
            } else if('email' == type) {
                axios.post('/user/newEmail',Qs.stringify({'email': vm.newEmail, 'code' : vm.newEmailVerify})).then(function (value) {
                    if('0000' == value.data.code) {
                        vm.changeAlert = value.data.msg;
                        $('#change-email').modal('close');
                        $('#change-alert').modal('open');
                    } else {
                        vm.changeAlert = value.data.msg;
                        vm.emailWrong = true;

                    }
                })
            }
        },
        clearInput: function () {
            var vm = this;
            if(vm.changeAlert == '成功') {
                location.reload();
            } else {
                vm.newName = '';
                vm.oldPass = '';
                vm.newPass = '';
                vm.repeatNewPass = '';
                vm.newEmail = '';
                vm.newEmailVerify = '';
            }
        },
        sendVerify: function () {
            var vm = this;
            axios.post("/verifyCode", Qs.stringify({'email' : vm.newEmail})).then(function (value) {
                if('0000' != value.data.code) {
                    vm.changeAlert = value.data.msg;
                    vm.emailWrong = true;
                } else {
                    vm.emailWrong = false;
                    vm.changeAlert = value.data.msg;
                    document.getElementById('send-btn').innerHTML = '已发送验证码';
                    document.getElementById('send-btn').disabled =  true;
                }
            })
        },
        choseTrash: function () {
            var vm = this;
            var data = new Array() ;
            $("[name='chose-trash']:checked").each(function (index, element) {
                data.push($(element).val());
            });
            vm.trashAll = false;
            if(data.length > 0) {
            axios.put('/file/recover', Qs.stringify({'id' : data.toString()})).then(function (value) {
                    vm.trashAlert = value.data.msg;
            })
            } else {
                vm.trashAlert = '先选择要删除的文件！';
            }
            $('#trash-alert').modal('open');
        },
        choseAll: function () {
            if ($("[name='total-trash']").is(":checked")) {
                $("[name='chose-trash']").prop("checked", true);
            } else {
                $("[name='chose-trash']").prop("checked", false);
            }
        },
        confirmTrash: function () {
            var vm = this;
            if(vm.trashAlert == '成功') {
                location.reload();
            }

        },
        confirmTrashAll: function () {
            axios.put('/file/recoverAll').then(function (value) {
                location.reload();
            })
        },
        allTrash: function () {
            var vm = this;
            vm.trashAll = true;
            vm.trashAlert = '确认清空回收站？'
            $('#trash-alert').modal('open');
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
        }
        var scale = (value.data.data.use / value.data.data.size) * 100;
        var usewidth = scale + '%';
        $('#use-bar').css("width", usewidth);
        $('#use-font').html(Math.round((value.data.data.use / (1024 * 1024)) * 100) / 100 + "G/" + Math.round(value.data.data.size / (1024 * 1024)) + "G");
        if (scale >= 50) {
            if (scale >= 80) {
                $("#use-bar").addClass("progress-bar-danger");
            } else {
                $("#use-bar").addClass("progress-bar-warning");
            }
        } else {
            $("#use-bar").addClass("progress-bar-success");
        };
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

    axios.get("/file/statistics").then(function (value) {
        if('0000' == value.data.code) {
            var ch = value.data.data;
            echarts.init(document.getElementById('numStatistics')).setOption({
                title: {
                    text: '文件数量统计',
                    left:'center'
                },
                series: {
                    name: '文件类型',
                    type: 'pie',
                    data: ch[0]
                },
                tooltip : {
                    formatter: "{b} : {c}"
                }
            });
            echarts.init(document.getElementById('sizeStatistics')).setOption({
                title: {
                    text: '空间使用情况',
                    left: 'center'
                },
                series: {
                    name: '使用空间',
                    type: 'pie',
                    data:ch[1]
                },
                tooltip: {
                    formatter: "{b} : {d}%"
                }
            });
        }
    })
});

function fileload() {
    $('#loading').hide();
    $('#myTabContent').show();
}




