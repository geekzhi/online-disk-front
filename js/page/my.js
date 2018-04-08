new Vue({
    el: "#main",
    data: {
        fileList: [],
        nowType: '',
        nowPage: 0,
        totalPage: 0,
        token: '',
        shareSelect: true,
        link: false,
        shareUrl: '',
        sharePass: '',
        shareMsg: ''
    },
    created: function () {
        var vm = this;
        vm.token = (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization");
    },
    methods: {
        getFileList: function (type) {
            var vm = this;
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
                vm.shareSelect = false;
                if('0000' == value.data.code) {
                    if('' == value.data.data.pass){
                     vm.shareUrl = value.data.data.url;
                    } else{
                        vm.shareUrl = value.data.data.url;
                        vm.sharePass = '提取密码：' + value.data.data.pass;
                    }
                    vm.link = true;
                }
            });
            }
        },
        close: function () {
            this.link = false;
            this.shareSelect = true;
        },
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
        }
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

function fileload() {
    $('#loading').hide();
    $('#myTabContent').show();
}

