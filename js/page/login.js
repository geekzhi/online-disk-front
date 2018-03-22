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
})
function hide(){
    $('#wrong').hide();
};