$(function () {
    axios.post('/user/userInfo').then(function (value) {
        if ((value.data == '')) {
            location.href = 'login.html';
        }
    }).catch(function (reason) {
        location.href = 'login.html';
    });
})