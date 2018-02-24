$(function () {
    $('#upload').click(function () {
        var formData = new FormData();
        var name = $("#file").val();
        formData.append("file",$("#file").get(0).files[0]);
        formData.append("name",name);
        axios("/file/upload",{
            method: "post",
            data: formData,
            processData: false,
            contentType: false,
        }).then(function (value) {
            if(value.data.code == "0000"){
                $('#msg').html(value.data.msg);
                $('#note').show();
                top.location.reload();
            } else {
                $('#msg').html(value.data.msg);
                $('#note').show();
            }
        });
    });
})
