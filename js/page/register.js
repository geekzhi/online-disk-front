$(function () {
    $('#code').keydown(function (event) {
        var key = event.keyCode;
        if(((key>=48 && key<=57) && ($('#code').val().length < 4)) || key == 8){

        }else{
            event.preventDefault();
        }
    })
    $(':input').keydown(function (event) {
        if(event.keyCode == 13) {
            $('#login').click();
        }
    });
    $('#register').click(function () {
        if ($('#name').val() == "" || $('#pass').val() == "" || $('#email').val() == "" || $('#code').val() == "" || $('#password').val() == "") {
            $('#msg').html("请补全信息");
            $('#note').show();
        } else {
            if ($('#password').val() == $('#re-password').val()) {
                axios.post("/register", Qs.stringify({
                    "name": $('#name').val(),
                    "pass": $('#pass').val(),
                    "email": $('#email').val(),
                    "verifyCode": $('#code').val(),
                    "pass": $('#password').val()
                })).then(function (value) {
                    $('#msg').html(value.data.msg);
                    $('#note').show();
                })
            } else {
                $('#msg').html("两次密码输入不一致");
                $('#note').show();
            }
        }
    });

    $('#verify-code').click(function () {
        if ($('#email').val() == "") {
            $('#msg').html("请补全信息");
            $('#note').show();
        } else {
            axios.post("/verifyCode", Qs.stringify({"email": $('#email').val()})).then(function (value) {
                if (value.data.code == "0000") {
                    $('#msg').html("验证码发送成功，请注意查收");
                    $('#note').show();
                    $('#verify-code').attr('disabled', "true");
                    second();
                } else {
                    $('#msg').html(value.data.msg);
                    $('#note').show();
                }
            })
        }
    });

});

function hide() {
    $('#note').hide();
};
var i = 60;
var t;

function second() {
    i = i - 1;
    $('#verify-code').html(i);
    if (i == 0) {
        clearTimeout(t);
        $('#verify-code').removeAttr("disabled");
        $('#verify-code').html("发送验证码");

    } else {
        t = setTimeout("second()", 1000)
    }
}