<?php
    header('Content-type: text/plain; charset= UTF-8');


    if(isset($_POST['age_top']) && isset($_POST['age_under'])){
        $age_top = $_POST['age_top'];
        $age_under = $_POST['age_under'];

        // $str = "AJAX REQUEST SUCCESS\nage_top:".$age_top."\nage_under:".$age_under."\n";
        // $result = nl2br($str);
        // echo $result;

        // echo ($age_top);
        // echo ($age_under);

        include 'db_config.php';

        try
        {
           $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
           $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


           $stmt1 = $db->query("SELECT * FROM residents
                                LEFT JOIN geocoding ON residents.address = geocoding.address
                                LEFT JOIN city ON residents.city_id = city.id
                                WHERE age>=$age_under && age<=$age_top;");

           $residents = $stmt1->fetchAll(PDO::FETCH_ASSOC);

           $db = null;
           // echo($residents);
        }
        catch(PDOException $e)
        {
         echo $e->getMessage();
         exit;
        }

    }elseif (isset($_POST['select_facility'])) {
      $facility = $_POST['select_facility'];
      // echo($facility);

      include 'db_config.php';

      try
      {
         $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
         $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


         $stmt1 = $db->query("SELECT * FROM city
                              LEFT JOIN facility ON city.id = facility.city_id
                              LEFT JOIN geocoding ON facility.address = geocoding.address
                              WHERE facility.name LIKE '%$facility%';");

         $facility_array = $stmt1->fetchAll(PDO::FETCH_ASSOC);

         $db = null;
         // echo($residents);
      }
      catch(PDOException $e)
      {
       echo $e->getMessage();
       exit;
      }
    }
    elseif (isset($_POST['house'])) {
      $house = $_POST['house'];
      // echo($house);

      include 'db_config.php';

      try
      {
         $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
         $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


         $stmt1 = $db->query("SELECT residents.id,residents.address,city_id,geocoding.id,geocoding.address,lat,lng
                              FROM residents
                              LEFT JOIN geocoding ON residents.address = geocoding.address
                              WHERE residents.address LIKE '%池上町%'
                              LIMIT 100");

         $house_array = $stmt1->fetchAll(PDO::FETCH_ASSOC);

         $db = null;
         // echo($house_array);
      }
      catch(PDOException $e)
      {
       echo $e->getMessage();
       exit;
      }
    }
    elseif (isset($_POST['select_value'])) {
      $area = $_POST['select_value'];
      // echo($area);

      include 'db_config.php';

      try
      {
         $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
         $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


         $stmt1 = $db->query("SELECT * FROM city
                              LEFT JOIN area ON city.area_id = area.id
                              LEFT JOIN residents ON city.id = residents.city_id
                              LEFT JOIN geocoding ON residents.address = geocoding.address
                              WHERE area_id = '$area';");

         $area_array = $stmt1->fetchAll(PDO::FETCH_ASSOC);

         $db = null;
         // echo($house_array);
      }
      catch(PDOException $e)
      {
       echo $e->getMessage();
       exit;
      }
    }
    elseif (isset($_POST['unoccupied_house'])) {
      $house = $_POST['unoccupied_house'];
      // echo($house);

      include 'db_config.php';

      try
      {
         $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
         $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


         $stmt1 = $db->query("SELECT residents.id,residents.address,city_id,geocoding.id,geocoding.address,lat,lng
                              FROM residents
                              LEFT JOIN geocoding ON residents.address = geocoding.address
                              WHERE residents.address LIKE '%池上町%'
                              && geocoding.id > 1290
                              LIMIT 100");

         $unoccupied_house_array = $stmt1->fetchAll(PDO::FETCH_ASSOC);

         $db = null;
         // echo($house_array);
      }
      catch(PDOException $e)
      {
       echo $e->getMessage();
       exit;
      }
    }
    else{
        echo 'FAIL TO AJAX REQUEST';
    }
?>



<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
</head>

<!--カスタムデータ属性にjson形式の配列をセット-->
<script id="sample"  data-json-test ='<?php echo json_encode($residents)?>'>
</script>
<script id="sample2"  data-json-test2 ='<?php echo json_encode($facility_array)?>'>
</script>
<script id="sample3"  data-json-test3 ='<?php echo json_encode($house_array)?>'>
</script>
<script id="sample4"  data-json-test4 ='<?php echo json_encode($area_array)?>'>
</script>
<script id="sample5"  data-json-test5 ='<?php echo json_encode($unoccupied_house_array)?>'>
</script>

</html>
