<?php
  include '../db_config.php';

  $age_under = $_POST['age_under'];
  $age_top = $_POST['age_top'];

  try
  {
     $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
     $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

     $stmt1 = $db->query("SELECT *
                          FROM residents
                          LEFT JOIN geocoding ON residents.address = geocoding.address
                          WHERE age >= $age_under && age <= $age_top");

     $residents = $stmt1->fetchAll(PDO::FETCH_ASSOC);

     $db = null;
  }
  catch(PDOException $e)
  {
   echo $e->getMessage();
   exit;
  }

  echo json_encode($residents);

?>
