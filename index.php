<?php
  include 'db_config.php';
  try
  {
     $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
     $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//地区
     $stmt = $db->query("SELECT * FROM area");
     $area = $stmt->fetchAll(PDO::FETCH_ASSOC);
//町
     $stmt = $db->query("SELECT * FROM city");
     $city = $stmt->fetchAll(PDO::FETCH_ASSOC);
//自治会・町内会
     $stmt = $db->query("SELECT * FROM association");
     $association = $stmt->fetchAll(PDO::FETCH_ASSOC);
//公共施設
     $stmt = $db->query("SELECT * FROM city
                          LEFT JOIN facility ON city.id = facility.city_id
                          LEFT JOIN geocoding ON facility.address = geocoding.address");
     $facility = $stmt->fetchAll(PDO::FETCH_ASSOC);
//住民
     $stmt = $db->query("SELECT * FROM residents
                          LEFT JOIN geocoding ON residents.address = geocoding.address
                          LEFT JOIN city ON residents.city_id = city.id");
     $residents = $stmt->fetchAll(PDO::FETCH_ASSOC);
//住民の設定
     $stmt = $db->query("SELECT * FROM residents_setting");
     $residents_setting = $stmt->fetchAll(PDO::FETCH_ASSOC);
// 公共施設の大きなジャンル
     $stmt = $db->query("SELECT * FROM class");
     $class = $stmt->fetchAll(PDO::FETCH_ASSOC);
// 公共施設の細かいジャンル
     $stmt = $db->query("SELECT * FROM detailed_class");
     $detailed_class = $stmt->fetchAll(PDO::FETCH_ASSOC);
//バス停
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
     $db = null;
  }
  catch(PDOException $e)
  {
   echo $e->getMessage();
   exit;
  }
?>


<!DOCTYPE html>
<html lang="ja">


<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
<title>TobaMap</title>



<!-- bootstrap -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<!-- タブ切り替え -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<!-- マップ -->
<script src="https://maps.googleapis.com/maps/api/js?key=APIKEY&callback=initMap" async></script>
<!-- スライドバー -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.0/css/ion.rangeSlider.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.0/js/ion.rangeSlider.min.js"></script>
<script src="https://cdn.jsdelivr.net/rangeslider.js/1.0.0/rangeslider.min.js"></script>
<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/rangeslider.js/1.0.0/rangeslider.css"> -->

<!-- <script src="takahashi/js/kmeans.js"></script> -->
<!-- cssファイル -->
<link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/facility.css">
<link rel="stylesheet" type="text/css" href="css/slider.css">

<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="js/marker.js"></script>
<script src="js/count.js"></script>
<script src="js/route.js"></script>
<script src="js/tsunami.js"></script>
<script src="js/kmeans.js"></script>
<script src="js/utility.js"></script>

<!-- <link href="square/blue.css" rel="stylesheet">
<script src="js/icheck.js"></script> -->

<!-- <link href="flat/blue.css" rel="stylesheet">
<script src="js/icheck.js"></script> -->

</head>


<body>


  <script>
   //$(document).ready(function(){
   //$('input').iCheck({
    // checkboxClass: 'icheckbox_square-blue',
     //radioClass: 'iradio_square-blue',
     //increaseArea: '20%' // optional
  // });
// });
  // $(document).ready(function(){
  //   $('input').iCheck({
  //     checkboxClass: 'icheckbox_flat-red',
  //     radioClass: 'iradio_flat-red'
  //   });
  // });
</script>



<main class="wrap">

  <!-- <button id="ajax">ajax</button> -->
  <div class="result"></div>

  <section>
	<div class="row">

  <div id="area9" class="col-sm-9">

      <div id="map"></div>

      <div class="slider_box" >
        <input id="slider" type="single" class="js-range-slider" name="my_range"  />
			</div>

    </div>

    <div id="area3" class="col-sm-3">
      <form name="check">

          <div class="box">
                <div class="tabbody">
                  <p class="title">地区</p>





    <!-- <ul>
      <li>
        <input type="checkbox" name="tall" id="tall">
        <label for="tall">全て選択</label>






              <ul>
                <li>
                  <div id="box_1" class="row">

                  <div id="box_3" class="col-sm-6">
                  <?php
                    foreach($area as $a){
                      $id = $a['id'];
                      $name = $a['name'];
                      echo "<div class='tall ul'><input type='checkbox' name='tall-{$id}' id='tall-{$id}'>
                            <label class='btn btn-link' for='tall-{$id}'>{$name}</label></div>";
                    }
                  ?>

                </div>


              <div id="box_2" class="col-sm-6">

                <ul>
                  <li>
                    <input type="checkbox" name="tall-2-1" id="tall-2-1">
                    <label for="tall-2-1">町</label>

                    <?php
                      foreach($city as $c){
                        $id = $c['id'];
                        $area_id = $c['area_id'];
                        $name = $c['name'];
                        if($area_id = 1){
                          echo "<input type='checkbox' name='tall-2-{$id}' id='tall-2-{$id}'>
                                <label for='tall-2-{$id}'>{$name}</label><br>";
                        }
                      }
                    ?>
                  </li>
                  <li>
                    <input type="checkbox" name="tall-2-2" id="tall-2-2">
                    <label for="tall-2-2">町</label>
                  </li>
                </ul>

              </div>


    </div>
            </li>
          </ul>






      </li>
    </ul> -->



                  <!-- <input id="all_tiku" type="checkbox" onchange="tikufunc()">全て選択 -->


                  <div id="tiku_box" class="row">
                    <div class="col-sm-6 area_city">
                      <?php
                        foreach($area as $a)
                        {
                          $id = $a['id'];
                          $area_name = $a['name'];
                          echo "<div class='mb-0 area_box'>
                                      <input id='area_{$id}' class='tiku' type='checkbox' onchange='areafunc({$id})'>
                                        <button  id='accordion{$id}' class='btn btn-link' type='button' onclick='change({$id})'>
                                          {$area_name}
                                        </button>
                                </div>";
                        }
                      ?>
                    </div>

                    <div id="city_detail" class="col-sm-6 line">
                    </div>
                  </div>
                </div>


                <div class="tabbody">
                      <p class="title">住民年齢層</p>
                      <input type="checkbox" id="all_resident" onchange="residentfunc()"/>全て選択

                        <div class="residents_set">
                          <table>
                              <tr>
                                  <td><input  class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">乳児
                                  <td><input id="baby" class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">幼児<br>
                                  </td>
                              </tr>
                              <tr>
                                  <td><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">小学生</td>
                                  <td><a><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">中学生</a>
                                  <td><a><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">高校生</a><br>
                                  </td>
                              </tr>
                              <tr>
                                  <td><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">青年</td>
                                  <td><a><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">壮年</a>
                                  <td><a><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">中年</a><br>
                                  </td>
                              </tr>
                              <tr>
                                  <td><input id="baby" class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">前期高齢
                                  <td><input class="resident" type="checkbox" name="check_child" onchange="all_checkbox()">後期高齢<br>
                                  </td>
                              </tr>
                          </table>

                          <div class="pt-2">
                             <input id="age_search" class="age_input" type="checkbox" name="check_child" value="1" onchange="all_checkbox()">
                                 <a>範囲指定</a>
                                 <input type="text" name = "age_top" id="age_top" class="age_box" value=20>
                                 ~
                                 <input type="text" name = "age_under" id="age_under" class="age_box" value=40>
                                 歳
                          </div>
                      </div>
                </div>

                <div class="tabbody mb-3">
                      <p class="title">住居</p>

                      <input id="house" class="occupied" name="check_child" href="#" type="checkbox" onchange="all_checkbox()">
                      </input>
                      <a id="circle2" href="~"></a>
                      <a class="mr-3">住居</a>

                      <input id="unoccupied_house" class="unoccupied" name="check_child" href="#" type="checkbox" onchange="all_checkbox()">
                      </input>
                      <a id="circle3" href="~"></a>
                      <a>空き家</a>
                </div>
          </div>



    <!-- シュミレーションタブ -->
      <!-- <p class="title">シミュレーション</p> -->
      <div class="simulate">

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#tsunami" role="tab" aria-controls="home" aria-selected="true">
              災害時予測
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#facility" role="tab" aria-controls="profile" aria-selected="false">
              公共施設の評価
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#route" role="tab" aria-controls="contact" aria-selected="false">
              バス・定期船
            </a>
          </li>
        </ul>

        <!-- タブの中身 -->
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="tsunami" role="tabpanel" aria-labelledby="home-tab">
            <p class="title">避難所</p><br>

            <input type="checkbox" onclick="plotTsunamiShelter(0)">津波
            <input type="checkbox" onclick="plotTsunamiShelter(1)">洪水
            <input type="checkbox" onclick="plotTsunamiShelter(2)">土砂
            <input type="checkbox" onclick="plotTsunamiShelter(3)">指定避難所
            <br><br>
            津波の高さ
            <div class="slider_tsunami">
                <input id="demo_5" type="range" />
            </div>


          </div><!-- 一つ目終了 -->

          <div class="tab-pane fade" id="facility" role="tabpanel" aria-labelledby="profile-tab">
            <!-- <div id="facility-box" class="switcharea facility_box"> -->
              <div class="row row_area">
                <div class="col-sm-6 facility_area">
                    <?php
                      foreach($class as $c)
                      {
                        $id = $c['id'];
                        $name = $c['name'];
                        echo "<div class='mb-0 facility_box'>
                                    <input id='class_{$id}' type='checkbox' onchange='facility_func({$id})'>
                                      <button  class='btn btn-link' type='button' onclick='facility_change({$id})'>
                                        {$name}
                                      </button>
                              </div>";
                      }
                    ?>
                </div>

                <div id="facility_detail" class="col-sm-6 facility_line">
                </div>
              </div>
            <!-- </div>  -->


            <form name="busForm">
              <a class="btn-square-pop facility_btn">設置提案</a>
              <a class="btn-square-pop facility_btn">リセット</a>

            </form>
          </div><!-- 二つ目終了 -->

          <div class="tab-pane fade" id="route" role="tabpanel" aria-labelledby="contact-tab">
            <div class="row row_area">
              <div class="col-sm-4 bus_area">
                <div class="facility_box">
                  <button  class="btn btn-link" type="button">
                    バス経路
                  </button>
                </div>
                <div class="facility_box">
                  <button  class="btn btn-link" type="button">
                    航路
                  </button>
                </div>
              </div>

              <div class="col-sm-8 bus_area">
                <div class="route-class bus">
                  <?php
                    foreach ($bus_routes as $b)
                    {
                      $id = $b['id'];
                      $name = $b['name'];
                      $route_flag = $b['route_flag'];
                      echo "<input id='bus_route{$route_flag}' type='radio' onchange='busfunc({$route_flag})'>{$name}<br>";
                    }
                  ?>

                  <!-- <form>
                    <input type="radio" name="check_child"> 鳥羽〜答志</br>
                  </form> -->
                </div>
              </div>
            </div>

            <!-- <input type="checkbox" name="check_child"> バス・船の現在地</br> -->

            <form name="busForm">
              <a class="btn-square-pop facility_btn" onclick="launchKmeans()">設置提案</a>
              <a class="btn-square-pop facility_btn" onclick="aa()">LIVE</a>
              <a class="btn-square-pop facility_btn">リセット</a>


            </form>
          </div><!-- 三つ目終了 -->
        </div>　<!-- class="tab-content" id="myTabContent"終了 -->

      </div>

        <!-- <br> -->
        <button id="web_create" type="button" class="btn btn-primary btn-block mt-5">MAPを作成</button>


    </form><!--form=check-->
  </div>
  </section>
  </main>

  	</div>




     <!--jsファイル-->
     <script src="js/facility.js"></script>
     <!-- <script src="js/map2.js"></script> -->
     <script src="js/map.js"></script>
     <!-- <script src="js/age.js"></script> -->
     <script src="js/slider.js"></script>



     <!-- 公共施設の配列をmap.jsに送る -->
     <!-- ちゃんと整理していく -->
     <script id="sample" data-json-test ='<?php echo json_encode($area)?>'>
     </script>
     <script id="sample2" data-json-test2 ='<?php echo json_encode($facility)?>'>
     </script>
     <script id="sample3" data-json-test3 ='<?php echo json_encode($city)?>'>
     </script>
     <script id="sample4" data-json-test4 ='<?php echo json_encode($association)?>'>
     </script>
     <script id="sample5" data-json-test5 ='<?php echo json_encode($residents)?>'>
     </script>
     <script id="sample6" data-json-test6 ='<?php echo json_encode($residents_setting)?>'>
     </script>
     <script id="sample7" data-json-test7 ='<?php echo json_encode($result)?>'>
     </script>
     <script id="sample8" data-json-test8 ='<?php echo json_encode($detailed_class)?>'>
     </script>
<!-- jQuery -->
<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> -->

</body>
</html>
