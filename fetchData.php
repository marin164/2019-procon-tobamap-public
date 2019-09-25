<?php
  include 'db_config.php';

  $case = $_GET['case'];

  $result = array();

  try{
      $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      if($case=="shelter"){
          $index = $_GET['index'];
          $pattern = ["tsunami_place","flood_shelter","landslide_shelter","designated_shelter"];
          $stmt = $db->query("SELECT * FROM `shelter` WHERE {$pattern[$index]} = 1");
          $shelter = $stmt->fetchAll(PDO::FETCH_ASSOC);
          $result = $shelter;
      }else if($case=="bus"){
          $stmt = $db->query("SELECT * FROM bus_route");
          $bus_routes = $stmt->fetchAll(PDO::FETCH_ASSOC);
          foreach ($bus_routes as $route){
              $route_flag = $route['route_flag'];
              $stmt = $db->query("SELECT * FROM bus_station WHERE route_flag & POWER(2,{$route_flag}) = POWER(2,{$route_flag})");
              $station = $stmt->fetchAll(PDO::FETCH_ASSOC);
              $tmp = array(
                  "id"=> $route['id'],
                  "name" => $route['name'],
                  "route" => $station
              );
              $result[] = $tmp;
          }
      }else{
          echo"error";
      }
      $db = null;
      echo json_encode($result);
  }catch(PDOException $e){
      echo $e->getMessage();
      exit;
  }
?>
