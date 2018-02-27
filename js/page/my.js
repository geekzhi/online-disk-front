$(function () {
    // axios.post('/user/username').then(function (value) {
    //     if ((value.data == '')) {
    //         location.href = 'login.html';
    //     } else {
    //         $('#username').html("Hello," + value.data);
    //     }
    // }).catch(function (reason) {
    //     location.href = 'login.html';
    // });

    $('#logout').click(function () {
        axios.get("/user/logout").then(function (value) {
            alert(value.data.msg);
            location.reload();
        });
    });
});

