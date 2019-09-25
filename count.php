<?php
  $range = $_POST['range'];
  $lat = $_POST['lat'];
  $lng = $_POST['lng'];
  $age_under = $_POST['age_under'];
  $age_top = $_POST['age_top'];

  include 'db_config.php';
  try{
       $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
       $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


       $stmt1 = $db->query("SELECT COUNT( * )
                            FROM geocoding RIGHT JOIN residents ON geocoding.address = residents.address
                            WHERE (
                            6371 * ACOS( -- kmの場合は6371、mileの場合は3959
                            COS( RADIANS( $lat ) )
                            * COS( RADIANS( lat ) )
                            * COS( RADIANS( lng ) - RADIANS( $lng ) ) + SIN( RADIANS( $lat ) )
                            * SIN( RADIANS( lat ) ) ) <= {$range} AND age >= $age_under AND age <= $age_top )");


       $range_sum = $stmt1->fetchColumn();



      $stmt2 = $db->query("SELECT COUNT( * )
                           FROM geocoding RIGHT JOIN residents ON geocoding.address = residents.address
                           WHERE (
                           6371 * ACOS( -- kmの場合は6371、mileの場合は3959
                           COS( RADIANS( $lat ) )
                           * COS( RADIANS( lat ) )
                           * COS( RADIANS( lng ) - RADIANS( $lng ) ) + SIN( RADIANS( $lat ) )
                           * SIN( RADIANS( lat ) ) ) <={$range} AND `sex` = '女' AND age >= $age_under AND age <= $age_top)");




                                $woman = $stmt2->fetchColumn();
                                $woman_per = $woman/$range_sum*100;






        $stmt3 = $db->query("SELECT COUNT( * )
                             FROM geocoding RIGHT JOIN residents ON geocoding.address = residents.address
                             WHERE (
                             6371 * ACOS( -- kmの場合は6371、mileの場合は3959
                             COS( RADIANS( $lat ) )
                             * COS( RADIANS( lat ) )
                             * COS( RADIANS( lng ) - RADIANS( $lng ) ) + SIN( RADIANS( $lat ) )
                             * SIN( RADIANS( lat ) ) ) <={$range} AND `sex` = '男' AND age >= $age_under AND age <= $age_top)");


                             $man = $stmt3->fetchColumn();
                             $man_per = $man/$range_sum*100;





         $stmt4 = $db->query("SELECT AVG(2019-age)
                              FROM geocoding RIGHT JOIN residents ON geocoding.address = residents.address
                              WHERE (
                              6371 * ACOS( -- kmの場合は6371、mileの場合は3959
                              COS( RADIANS( $lat ) )
                              * COS( RADIANS( lat ) )
                              * COS( RADIANS( lng ) - RADIANS( $lng ) ) + SIN( RADIANS( $lat ) )
                              * SIN( RADIANS( lat ) ) ) <={$range} AND age >= $age_under AND age <= $age_top)");

             $age_avg = $stmt4->fetchColumn();



       $db = null;
    }
    catch(PDOException $e)
    {
     echo $e->getMessage();
     exit;
  }
  echo $range_sum;
  echo "&";
  echo $woman_per;
  echo "&";
  echo $man_per;
  echo "&";
  echo $age_avg;
  echo "&";
  echo $lat;
  echo "&";
  echo $lng;
//
?>
