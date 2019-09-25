<?php
    header('Content-type: text/plain; charset= UTF-8');
    if(isset($_POST['userid']) && isset($_POST['passward'])){
        $id = $_POST['userid'];
        $pas = $_POST['passward'];
        $str = "AJAX REQUEST SUCCESS\nuserid:".$id."\npassward:".$pas."\n";
        $result = nl2br($str);
        echo $result;
    }else{
        echo 'FAIL TO AJAX REQUEST';
    }
?>
