new Vue({
    el: "#file",
    data: {
        fileList: [],
        upperPath: '',
        jumpFiles: [],
        test:'13'
    },
    created: function () {
        var vm = this;
        axios.post('/file/fileList/path', Qs.stringify({'parentPath': 'root'})).then(function (value) {
            vm.upperPath = '/';
            console.log(value.data);
            if (!(value.data == '')) {
                for (var i = 0; i < value.data.data.length; i++) {
                    vm.fileList.push(value.data.data[i]);
                }
            }
        });
    },
    methods: {
        open: function (name, parentPath, type) {
            if ('folder' == type) {
                var vm = this;
                var path = parentPath == '/' ? ('/' + name) : (parentPath + '/' + name);
                vm.upperPath = path;
                vm.jumpFiles = path.split('/').splice(1);
                axios.post('/file/fileList/path', Qs.stringify({'parentPath': path})).then(function (value) {
                    // vm.upperPath = (parentPath == '/' ? '/' : path);
                    vm.fileList = [];
                    if (!(value.data == '')) {
                        for (var i = 0; i < value.data.data.length; i++) {
                            vm.fileList.push(value.data.data[i]);
                        }
                    }
                });
            }
        },
        goBackStepOne: function () {
            var vm = this;
            var n;
            console.log(vm.upperPath)
            if (vm.upperPath != '/') {
                var str = vm.upperPath;
                n = str.split('/');
                if (n.length == 2) {
                    n = '/';
                } else {
                    n.pop();
                    n = n.toString().replace(/,/g, '/');
                }

            } else {
                n = '/'
            }
            ;
            axios.post('/file/fileList/path', Qs.stringify({'parentPath': n})).then(function (value) {
                vm.upperPath = n;
                vm.jumpFiles = n.split('/').splice(1);
                vm.fileList = [];
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        vm.fileList.push(value.data.data[i]);
                    }
                }
            });
        },
        newFolder: function () {
            var vm = this;
            axios.post('/file/folder', Qs.stringify({'parentPath': vm.upperPath})).then(function (value) {
                if ('0000' == value.data.code) {
                    alert("成功");
                    vm.fileList = [];
                    if (!(value.data == '')) {
                        for (var i = 0; i < value.data.data.length; i++) {
                            vm.fileList.push(value.data.data[i]);
                        }
                    }
                } else {
                    alert("失败");
                }
            })
        },
        jumpFilePage: function (index) {
            var vm = this;
            if (index < vm.jumpFiles.length - 1) {
                var aim = [];
                for (var i = 0; i <= index; i++) {
                    aim[i] = vm.jumpFiles[i];
                }
                vm.jumpFiles = [];
                for (var i = 0; i < aim.length; i++) {
                    vm.jumpFiles[i] = aim[i];
                }
                vm.upperPath = '/' + aim.toString().replace(/,/g,"/");
                var path = '/' + aim.toString().replace(/,/g,"/");
                axios.post('/file/fileList/path', Qs.stringify({'parentPath': path})).then(function (value) {
                    // vm.upperPath = (parentPath == '/' ? '/' : path);
                    vm.fileList = [];
                    if (!(value.data == '')) {
                        for (var i = 0; i < value.data.data.length; i++) {
                            vm.fileList.push(value.data.data[i]);
                        }
                    }
                });
            }
        },
        allFile: function () {
            location.reload();
        },
        fileClose: function () {
            var vm = this;
            axios.post('/file/fileList/path', Qs.stringify({'parentPath': vm.upperPath})).then(function (value) {
                vm.fileList = [];
                if (!(value.data == '')) {
                    for (var i = 0; i < value.data.data.length; i++) {
                        vm.fileList.push(value.data.data[i]);
                    }
                }
            });
        },
        video:function (name, path) {
            sessionStorage.setItem("videopath", path);
            window.open("video_player.html");
        }
    }
});
$(function () {
    // var uploadPath = '';
    // $('#uploadFile').click(function () {
    //     uploadPath = $('#upper').html();
    //     sessionStorage.setItem("uploadPath", uploadPath);
    //     console.log(uploadPath);
    // });
    var batch;
    $('#input-upfile').on('filepreajax', function(event, previewId, index) {
        batch = {
            "parentPath": $("#upper").html(),
            "token": (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization")
        };
    });
    $("#input-upfile").fileinput({
        theme: 'fa',
        showPreview: false,
        // showUpload: false,
        elErrorContainer: '#kartik-file-errors',
        allowedFileExtensions: ["jpg", "png", "gif", "mp4"],
        uploadUrl: 'http://localhost:8080/file/upload',
        uploadExtraData: function () {
            return batch;
        }
    });
});
