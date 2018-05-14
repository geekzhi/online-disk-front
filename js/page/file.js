new Vue({
    el: "#file",
    data: {
        fileList: [],
        upperPath: '',
        jumpFiles: [],
        token: '',
        deleteFile: '',
        renameId: '',
        renameType: '',
        newName: '',
        show: false,
        noticeMess: '',
        suffixFolder: [],
        searchFileName: '',
        vip: '',
        starFileId: '',
        starNum: ''
    },
    created: function () {
        var vm = this;
        axios.post('/user/userInfo').then(function (value) {
            if (value.data.data.vip == 1) {
                vm.vip = true;
            } else {
                vm.vip = false;
            }
        });
        axios.post('/file/fileList/path', Qs.stringify({'parentPath': 'root'})).then(function (value) {
            vm.upperPath = '/';
            if (!(value.data == '')) {
                for (var i = 0; i < value.data.data.length; i++) {
                    vm.fileList.push(value.data.data[i]);
                }
            }
        });
        vm.token = (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization");
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
        video: function (id) {
            var vm = this;
            sessionStorage.setItem("videopath", '/nginx/file/' + id + '?token=' + vm.token);
            window.open("video_player.html");
        },
        setDelete: function (id, type) {
            this.deleteFile = id + ',' + type;
        },
        delete_file: function () {
            var file = this.deleteFile.split(',');
            axios.post('/file/delete', Qs.stringify({'id': file[0], 'type': file[1]})).then(function (value) {
                if ('0000' == value.data.code) {
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
                if ('0000' == value.data.code) {
                    location.reload();
                }
            })
        },
        hideMess: function () {
            this.show = false;
        },
        share: function (id) {
            window.parent.$('#shareModal').modal({closeViaDimmer: false});
            window.parent.$('#shareModal').modal('open');
            sessionStorage.setItem("file-share", id);
        },
        search: function () {
            var vm = this;
            if (vm.searchFileName != '') {
                axios.get('/file/search/' + vm.searchFileName).then(function (value) {
                    if (!(value.data == '')) {
                        vm.fileList = [];
                        for (var i = 0; i < value.data.data.length; i++) {
                            vm.fileList.push(value.data.data[i]);
                        }
                    }
                })
            }
        },
        starFile: function (id) {
            this.starFileId = id;
        },
        star: function (level) {
            var vm = this;
            vm.starNum = level;
            axios.put("/file/star", Qs.stringify({"id": vm.starFileId, "star": vm.starNum}));
            $('#starConfirm').click();
            location.reload();
        }
    }
});
var md5;
$(function () {

    $("[data-toggle='tooltip']").tooltip();
    var batch;
    $('#input-upfile').on('filepreajax', function (event, previewId, index) {
        batch = {
            "parentPath": $("#upper").html(),
            "token": (sessionStorage.getItem("Authorization") == null) ? localStorage.getItem("Authorization") : sessionStorage.getItem("Authorization"),
            "md5": md5
        };
    });
    $("#input-upfile").on("filebatchselected", function(event, files) {
       getMd5(callBack);
    });
    $("#input-upfile").fileinput({
        theme: 'fa',
        showPreview: false,
        // showUpload: false,
        elErrorContainer: '#kartik-file-errors',
        allowedFileExtensions: ["jpg", "png", "gif", "mp4"],
        uploadUrl: 'http://106.15.183.161:8080/file/upload',
        uploadExtraData: function () {
            return batch;
        }
    });

    // $("#input-upfile").change(function () {
    //     getMd5(callBack);
    //     console.log(md5);
    // })
    function callBack(md) {
        md5 = md;
    }
    function getMd5(callBack) {
        var fileReader = new FileReader(),
            blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
            file = document.getElementById("input-upfile").files[0],
            chunkSize = 2097152,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            bs = fileReader.readAsBinaryString,
            spark = bs ? new SparkMD5() : new SparkMD5.ArrayBuffer();

        fileReader.onload = function (ee) {
            spark.append(ee.target.result);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                md5 = spark.end();
            }
        }
        function loadNext() {
            var start = currentChunk * chunkSize, end = start + chunkSize >= file.size ? file.size : start + chunkSize;
            if (bs) fileReader.readAsBinaryString(blobSlice.call(file, start, end));
            else fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
    };

});
