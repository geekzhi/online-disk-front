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
        trashAll: false,
        cancelId: '',
        choseShare: false,
        shareDetail: '',
        followFile: []
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
            } else if ('face' == type) {
                $('#change-face').modal('open');
                $('#open_cam').click();
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
            } else if('face' == type) {
                $('#take_cam').click();
                var data=document.getElementById('canvas1').toDataURL('image/jpeg');
                axios.post('/user/newFace', Qs.stringify({'faceImg' : data})).then(function (value) {
                    $('#success-alert').modal('open');
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
            $("[name='chose']:checked").each(function (index, element) {
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
            if ($("[name='total']").is(":checked")) {
                $("[name='chose']").prop("checked", true);
            } else {
                $("[name='chose']").prop("checked", false);
            }
            if($("[name='chose']:checked").length > 0) {
                this.choseShare = true;
            } else {
                this.choseShare = false;
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
            vm.trashAlert = '确认恢复所有文件？'
            $('#trash-alert').modal('open');
        },
        getShareFile: function () {
            var vm = this;
            vm.fileList = [];
            vm.choseShare = false;
            axios.get('/file/shareFileList').then(function (value) {
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        if(value.data.data[i].shareValid != 2) {
                            if(value.data.data[i].shareValid - parseInt(parseInt(new Date() - new Date(value.data.data[i].shareTime))/1000/60/60/24) >= 0){
                                vm.fileList.push(value.data.data[i]);
                            }
                        } else {
                            vm.fileList.push(value.data.data[i]);
                        }
                    }
                }
            });
        },
        cancelShare: function(i) {
                this.cancelId = i;
                $('#cancel-alert').modal('open');
        },
        cancelShareFile: function () {
            var vm = this;
            axios.put('/file/cancelShare', Qs.stringify({'id' : vm.cancelId})).then(function (value) {
                vm.getShareFile();
            })
        },
        cancelShareChange: function () {
            if($("[name='chose']:checked").length > 0) {
                this.choseShare = true;
            }else {
                this.choseShare = false;
            }
        },
        cancelAllShare: function () {
            var vm = this;
            var data = new Array() ;
            $("[name='chose']:checked").each(function (index, element) {
                data.push($(element).val());
            });
            axios.put('/file/cancelAllShare', Qs.stringify({'id':data.toString()})).then(function (value) {
                vm.getShareFile();
            })
        },
        openShare: function (code) {
            window.open("http://localhost:8081/share.html?code=" + code);
        },
        showShareDetail: function (code, pass) {
            var passStr = "";
            if(pass != '') {
                passStr = "提取码：" + pass;
            }
            this.shareDetail = "<p>地址：<a href='http://localhost:8081/share.html?code=" + code + "'>http://localhost:8081/share.html?code=" +  code + "</a><br>" + passStr;
            $('#share-detail-alert').modal('open');
        },
        getShare: function () {
            var vm = this;
            vm.followFile = [];
            axios.get("/user/follow").then(function (value) {
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        value.data.data[i].shareCode = "http://localhost:8081/share.html?code=" + value.data.data[i].shareCode;
                        vm.followFile.push(value.data.data[i]);
                    }
                }
            });
        },
        searchStar: function () {
            var vm = this;
            var data = new Array();
            vm.fileList = [];
            $('#starChoose').each(function (index, element) {
                data.push($(element).val());
            })
            axios.post("/file/starFile", Qs.stringify({"star" : data.toString()})).then(function (value) {
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        vm.fileList.push(value.data.data[i]);
                    }
                }
            });
            $('#star-file').show();
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
            $('#uvip').attr("src","../img/vip-on.png");
        } else {
            $('#uvip').attr("src","../img/vip-off.png");
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

        if(value.data.data.notice == 0) {
            $('#notice-tip').attr("class", "");
        } else {
            $('#notice-tip').attr("class", "tip");
        }
    }
}).catch(function (reason) {
    location.href = 'login.html';
});

$(function () {
    $('#logout').click(function () {
        axios.get("/user/logout").then(function (value) {
            location.reload();
        });
    });

    $('#u-notice').click(function () {
        axios.put("/user/readNotice");
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


var video = document.querySelector('video');
var audio, audioType;

var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext('2d');

// var canvas2 = document.getElementById('canvas2');
// var context2 = canvas2.getContext('2d');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var exArray = []; //存储设备源ID
MediaStreamTrack.getSources(function (sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        //这里会遍历audio,video，所以要加以区分
        if (sourceInfo.kind === 'video') {
            exArray.push(sourceInfo.id);
        }
    }
});

function getMedia() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            'video': {
                'optional': [{
                    'sourceId': exArray[1] //0为前置摄像头，1为后置
                }]
            },
            'audio':true
        }, successFunc, errorFunc);    //success是获取成功的回调函数
    }
    else {
        alert('Native device media streaming (getUserMedia) not supported in this browser.');
    }
}

function successFunc(stream) {
    //alert('Succeed to get media!');
    if (video.mozSrcObject !== undefined) {
        //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持
        video.mozSrcObject = stream;
    }
    else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }

}
function errorFunc(e) {
    alert('Error！'+e);
}


// 将视频帧绘制到Canvas对象上,Canvas每60ms切换帧，形成肉眼视频效果
function drawVideoAtCanvas(video,context) {
    window.setInterval(function () {
        context.drawImage(video, 0, 0,350,250);
    }, 60);
}

//拍照
function getPhoto() {
    context1.drawImage(video, 0, 0,350,250); //将video对象内指定的区域捕捉绘制到画布上指定的区域，实现拍照。
}




