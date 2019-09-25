<?php
  date_default_timezone_set('Asia/Tokyo');

  include "db_config.php";


  $root_dir = "Shots";

  $mac = $_POST['mac'];
  $now = date('Y-m-d H:i:s');



  // rpi_unit_id 取得
  try {
     $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
     $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

     // rpi_unit_idの取得
     $stmt = $db->query("SELECT id FROM rpi_units WHERE mac = '{$mac}'");
     $unit = $stmt->fetch(PDO::FETCH_ASSOC);
     $rpi_unit_id = $unit['id'];

     $db = null;
  }
  catch(PDOException $e) {
   echo $e->getMessage();
   exit;
  }

  $dir_path = $root_dir . "/" . sprintf( "%s/%d/", date("Y-m-d", strtotime($now)), $rpi_unit_id);
  $file_name = sprintf( "%d_%s.jpeg" , $rpi_unit_id, date('md_His', strtotime($now)));
  $save_img_path = $dir_path . $file_name;


  // 保存用のディレクトリチェック
  if(!file_exists(dirname($dir_path))) {
    mkdir( $dir_path, 0777, true );
  }


  // ファイルの保存
  if(is_uploaded_file($_FILES['shot']['tmp_name'])) {
    if(move_uploaded_file($_FILES['shot']['tmp_name'], $save_img_path)) {

      //echo "saved";
      try {
         $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
         $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $stmt = $db->prepare("INSERT INTO snap_shots (rpi_unit_id, file_name, shot_time)
                                VALUES(:rpi_unit_id, :file_name, :shot_time)");
         $stmt->execute([
          ':rpi_unit_id' => $rpi_unit_id,
          ':file_name' => str_replace($root_dir . "/", '', $save_img_path),
          ':shot_time' => $now,
         ]);


         $db = null;
      }
      catch(PDOException $e) {
       echo $e->getMessage();
       exit;
      }
    }
    else {
      echo "error while saving.";
    }
  }
  else {

    echo "file not posted";
  }



 ?>
