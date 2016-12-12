$(function() {
    $('.btn-delete-movie').on('click', function(event) {
        // debugger;
        var id = $(event.target).val();
        $.ajax({
            type: "POST",
            url: '/movie/delete',
            data: {"id": id},
            // 指定响应数据格式是json
            // dataType: "json",
            // contentType: "application/json",
            // contentType: "text/json",
            success: function(data, textStatus) {
                // alert(data.success)
                if (data.success) {
                    $('#msg').html('成功删除!');
                    $('#msg').addClass('alert alert-success');
                    $(event.target).parents("tr").hide();
                } else {
                    $('#msg').html(data.err);
                    $('#msg').addClass('alert alert-error');
                }
            }
        });
    });
});