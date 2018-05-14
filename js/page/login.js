$(function () {
    axios.post('/user/userInfo').then(function (value) {
        if (!(value.data == '')) {
            location.href = 'my.html';
        }
    });
    $('#login').click(function () {
        if($('#name').val() == "" || $('#pass').val() == "") {
            $('#login-msg').html("请补全信息");
            $('#wrong').show();
        } else {
            $('#login-msg').html("登录中，请稍后。。。");
            $('#wrong').show();
            axios.post("/login", Qs.stringify({
                "name": $('#name').val(),
                "pass": $('#pass').val(),
                "remember": $("#remember:checked").val()
            })).then(function (value) {
                if (value.data.code == '0000') {
                    if ($('#remember:checked').val() == 'on') {
                        localStorage.setItem("Authorization", value.data.data);
                    } else {
                        sessionStorage.setItem("Authorization", value.data.data);
                    }
                    location.href = 'my.html';
                } else {
                    $('#login-msg').html(value.data.msg);
                    $('#wrong').show();
                }
            }).catch(function (error) {
                $('#login-msg').html("系统错误");
                $('#wrong').show();
            });
        }
    });
    $(':input').keydown(function (event) {
        if(event.keyCode == 13) {
            $('#login').click();
        }
    });

    $('#face-login').click(function () {
        $('#face-alert').modal('open');
        $('#open_cam').click();
    });

    $(function () {
        $('#cam_login').click(function () {
            $('#take_cam').click();
            var data=document.getElementById('canvas1').toDataURL('image/jpeg');
            axios.post("/login", Qs.stringify({
                "name": $('#fname').val(),
                "face": data
            })).then(function (value) {
                if (value.data.code == '0000') {
                    localStorage.setItem("Authorization", value.data.data);
                    sessionStorage.setItem("Authorization", value.data.data);
                    location.href = 'my.html';
                } else {
                    $('#alert-content').html(value.data.msg);
                    $('#alert').modal('open');
                }
            }).catch(function (error) {
                $('#login-msg').html("系统错误");
                $('#wrong').show();
            });
        })
    })

});
function hide(){
    $('#wrong').hide();
};



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
