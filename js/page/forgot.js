$(function () {
    $(':input').keydown(function (event) {
        if(event.keyCode == 13) {
            $('#login').click();
        }
    });
    $('#forgot').click(function () {
        if($('#email').val() == "") {
            $('#msg').html("邮箱格式不正确");
            $('#note').show();
        } else {
            $('#msg').html("正在发送，请稍后。。。");
            $('#note').show();
            axios.post("/forgot", Qs.stringify({"email": $('#email').val()})).then(function (value) {
                if(value.data.code == "0000") {
                    $('#msg').html("已发送邮件到您的邮箱，请注意查收！");
                    $('#note').show();
                } else {
                    $('#msg').html(value.data.msg);
                    $('#note').show();
                }
            });
        }
    });
});
function hide(){
    $('#note').hide();
};