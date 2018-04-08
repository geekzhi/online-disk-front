new Vue({
    el: "#file",
    data: {
        fileList: [],
        upperPath: '',
        jumpFiles: [],
        token:'',
        deleteFile:'',
        renameId: '',
        renameType: '',
        newName: '',
        show: false,
        noticeMess: '',
        suffixFolder: []
    },
    created: function () {
        var vm = this;
        axios.post('/file/fileList/path', Qs.stringify({'parentPath': 'root'})).then(function (value) {
            vm.upperPath = '/';
            if (!(value.data == '')) {
                for (var i = 0; i < value.data.data.length; i++) {
                    vm.fileList.push(value.data.data[i]);
                }
            }
        });
        vm.token = (sessionStorage.getItem("Authorization") == null)?localStorage.getItem("Authorization"):sessionStorage.getItem("Authorization");
    },
    methods: {
        open: function (name, parentPath, type, suffixName) {
            if ('folder' == type) {
                var vm = this;
                var path = parentPath == '/' ? ('/' + name) : (parentPath + '/' + name);
                vm.upperPath = path;
                vm.jumpFiles = path.split('/').splice(1);
                vm.suffixFolder.push(suffixName);
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
                vm.suffixFolder.pop();
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
                vm.upperPath = '/' + aim.toString().replace(/,/g, "/");
                var path = '/' + aim.toString().replace(/,/g, "/");
                axios.post('/file/fileList/path', Qs.stringify({'parentPath': path})).then(function (value) {
                    // vm.upperPath = (parentPath == '/' ? '/' : path);
                    vm.fileList = [];
                    if (!(value.data == '')) {
                        for (var i = 0; i < value.data.data.length; i++) {
                            vm.fileList.push(value.data.data[i]);
                        }
                    }
                });
                for (var i = 0; i < vm.suffixFolder.length - index; i++) {
                    vm.suffixFolder.pop();
                }
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
        video:function (id) {
            var vm = this;
            sessionStorage.setItem("videopath", '/nginx/file/' + id + '?token=' + vm.token);
            window.open("video_player.html");
        },
        setDelete: function (id, type) {
            this.deleteFile = id + ',' + type;
        },
        delete_file: function () {
            var file = this.deleteFile.split(',');
            axios.post('/file/delete', Qs.stringify({'id':file[0], 'type':file[1]})).then(function (value) {
                if('0000' == value.data.code) {
                    console.log('删除成功');
                }
                location.reload();
            })
        },
        setRename: function (id, type) {
            this.renameId = id;
            this.renameType = type;
        },
        rename: function () {
            var vm = this;
            vm.show = false;
            console.log(vm.renameId + '  ' + vm.newName + '  ' + vm.renameType);
            axios.put('/file/' + vm.renameId + '/' + vm.newName + '/' + vm.renameType).then(function (value) {
                vm.noticeMess = value.data.msg;
                vm.show = true;
                if('0000' == value.data.code){
                    location.reload();
                }
            })
        },
        hideMess: function () {
            this.show = false;
        },
        share: function (id) {
            window.parent.$('#shareModal').modal('show');
            sessionStorage.setItem("file-share", id);
        }
    }
});
$(function () {

    $("[data-toggle='tooltip']").tooltip();
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
        // allowedFileExtensions: ["jpg", "png", "gif", "mp4"],
        uploadUrl: 'http://localhost:8080/file/upload',
        uploadExtraData: function () {
            return batch;
        }
    });


});
