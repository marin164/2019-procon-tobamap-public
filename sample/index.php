<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <form id="form_1" method="post" accept-charset="utf-8" return false>
        <p>名前 <input type="text" name = "userid" id ="userid"> </p>
        <p>パスワード <input type="text" name = "passward" id="passward"> </p>
    </form>

    <button id="ajax">ajax</button>
    <div class="result"></div>

    <script type="text/javascript">

        $(function(){
            // Ajax button click
            $('#ajax').on('click',function(){
                $.ajax({
                    url:'./request.php',
                    type:'POST',
                    data:{
                        'userid':$('#userid').val(),
                        'passward':$('#passward').val()
                    }
                })
                // Ajaxリクエストが成功した時発動
                .done( (data) => {
                    $('.result').html(data);
                    console.log(data);
                })
                // Ajaxリクエストが失敗した時発動
                .fail( (data) => {
                    $('.result').html(data);
                    console.log(data);
                })
                // Ajaxリクエストが成功・失敗どちらでも発動
                .always( (data) => {

                });
            });
        });

    </script>
</body>
</html>
