$(function () {
    axios.post('/user/username').then(function (value) {
        if ((value.data == '')) {
            location.href = 'login.html';
        }
    }).catch(function (reason) {
        location.href = 'login.html';
    });
})