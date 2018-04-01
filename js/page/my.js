axios.post('/user/userInfo').then(function (value) {
    if ((value.data.code != '0000')) {
        location.href = 'login.html';
    } else {
        console.log(value.data.data);
        $('#username').html(value.data.data.name);
        if(value.data.data.vip == '1'){
            $('#username').css("color", "orange");
        }
        var scale = (value.data.data.use / value.data.data.size) * 100;
        var usewidth = scale + '%';
        $('#use-bar').css("width", usewidth);
        $('#use-font').html(Math.round((value.data.data.use/(1024*1024))*100)/100 + "G/" + Math.round(value.data.data.size/(1024*1024)) + "G");
        if(scale >= 50) {
            if(scale >= 80) {
                $("#use-bar").addClass("progress-bar-danger");
            } else {
                $("#use-bar").addClass("progress-bar-warning");
            }
        } else{
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

    $('#pic-tag').click(function () {
        $('#loading').show();
        $('#myTabContent').hide();
        $('#pic-frame').attr('src', $('#pic-frame').attr('src'));
    });
    $('#file-tag').click(function () {
        $('#loading').show();
        $('#myTabContent').hide();
        $('#file-frame').attr('src', $('#file-frame').attr('src'));
    })
     // $('#user-jum').css("color","orange");
    //  $('#user-jum').css("background","url('static/3ce5f20ddc624681834fe9f100659d47.png')")

});
function fileload() {
    $('#loading').hide();
    $('#myTabContent').show();
}

