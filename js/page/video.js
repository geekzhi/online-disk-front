
// ck("#video","http://img.ksbbs.com/asset/Mon_1703/05cacb4e02f9d9e.mp4");
new Vue({
    el: "#video",
    data: {
        videoList: []
    },
    created: function () {
        var vm = this;
        axios.get('/file/fileList/video').then(function (value) {
            if (!(value.data == '')) {
                for (var i = 0; i < value.data.data.length; i++) {
                    vm.videoList.push(value.data.data[i]);
                }
            }
        });
    }
});


function ck(con, videoPath){
    var videoObject = {
        container: con, //容器的ID或className
        variable: 'player',//播放函数名称
        poster:'images/poster.jpg',//封面图片
        video: videoPath
    };
    var player = new ckplayer(videoObject);
};