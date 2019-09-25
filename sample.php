<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <title>BAE</title>

  <!-- <link rel="stylesheet" href="css/Main.css"> -->
  <link rel="shortcut icon" href="BAE.png" >
  <!-- <link rel="stylesheet" href="css/rangeslider.css"> -->
  <!-- <link rel="stylesheet" href="css/ion.rangeSlider.min.css"> -->

  <!-- <style>
  .irs--flat .irs-bar {
    background-color: transparent;
  }
  </style> -->

  <style>
  html { height: 100% }
  body { height: 100% }
  /* #map { height: 100%; width: 100%} */

  #maps {
    width: 100%;
    height: 80%;
    background-color: grey;
    /* margin-bottom: 80px; */
    margin-bottom: 60px;
    margin-top: 25px;
  }
  </style>

</head>

<body>
  <script>
  // グローバル変数
  var map;
  var heatmap;
  // var HEATMAP_MAX_INTENSITY = 50;
  var heatmap_radius_in_pixel = 60;
  var heatmapData = [];


  /*------------------------------------------
   * GoogleMapの初期設定
   *------------------------------------------*/
   // 一番はじめに実行される
  function initialize(){

    var dt = new Date();
    var hours = dt.getHours();
    console.log(hours);

    $("#slider").ionRangeSlider({
        type: 'single',
        skin: "round",
        //  メモリ設定
        values:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        // values:[0,3,6,9,12,15,18,21,23],
        grid: true,
        min: 0,
        max: 23,
        // fromを現在時刻にする
        from: hours,
        step: 1,
        postfix: " 時",
        onFinish: function (data) {
            console.log(data.from);
            getHeatMapData(data.from);
        },
      });


    var MyLatLng = new google.maps.LatLng(34.481833, 136.83825);
    var Options = {
     zoom: 15,      //地図の縮尺値
     center: MyLatLng,    //地図の中心座標
     mapTypeId: 'roadmap'   //地図の種類
    };
    map = new google.maps.Map(document.getElementById('maps'), Options);
    heatmap = new google.maps.visualization.HeatmapLayer({data: [] });

 // heat.phpから取得した時間
    getHeatMapData(hours);

  }


  /*------------------------------------------
   * GoogleMapのheatmapレイヤーを準備する
   *------------------------------------------*/
  function setHeatMap(heatmap_data)
  {
    // nullにすることでさっきのmapをけす
    //heatmap.setData(null);
    heatmapData=[];


    // heatmapの描画
   for(var i=0; i<heatmap_data.length; i++)
   {
     var data = heatmap_data[i];

     var heatmap_weight = data['count_num'];
     var location = new google.maps.LatLng(data['lat'], data['lng']);

     var elements =
     ({
       location : location,
       weight : heatmap_weight,
     });

     heatmapData.push(elements);
  }

   // heatmap.set('maxIntensity', HEATMAP_MAX_INTENSITY);
   heatmap.set('radius', heatmap_radius_in_pixel);

   if(heatmap.getMap() == null)
   {11
     heatmap.setMap(map);
     heatmap.setData(heatmapData);
   }
   else
   {
     heatmap.setData(heatmapData);// setDataでデータ更新する
   }
  }

   /*-----------------------------------------------
    * ヒートマップのデータを取得する処理
    *-----------------------------------------------*/
    var parameter;
   function getHeatMapData(date_time)
   {
    parameter = {time: date_time};
     console.log(parameter);
     exePHPFunc("heat.php", parameter).done(function(data){
       console.log(data);
       // 文字列をJSONとして解析する
       setHeatMap(JSON.parse(data));
     });
   }

   /* -----------------------------------
    * phpを呼び出す
    * -----------------------------------*/
    var php_url = "heat.php";
   function exePHPFunc(php_url, parameter)
   {
     var defer = $.Deferred();

 // heat.phpにpost
     $.ajax({
       url: 'heat.php',
       type: "POST",
       data: parameter,
       scriptCharset: 'utf-8',
       success: defer.resolve,
     });
     return defer.promise();
   }
  </script>




  <div id="maps"></div>
  <input id="slider" type="text" class="js-range-slider" name="my_range" value="" />

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.0/css/ion.rangeSlider.min.css"/>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.0/js/ion.rangeSlider.min.js"></script>


  <!--jQuery-->
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> -->
  <!--Plugin JavaScript file-->
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.0/js/ion.rangeSlider.min.js"></script> -->

<script type="text/javascript"
        src="//maps.googleapis.com/maps/api/js?key=AIzaSyCjpcBI57XAEzvIqzNBEj4eIpVzRaRe93U&libraries=visualization&callback=initialize">
</script>
  <!-- <script type="text/javascript" src="js/kamaya.js"></script> -->

  <style>
  .irs--round .irs-bar {
    background-color: transparent;
  }

  .irs--round .irs-single{
    background-color: #FF4000;
    font-size: 30px;
    padding: 5px;
  }

  .irs--round .irs-handle{
    background-color: #FF4000;
    border: 4px solid #FF4000;
  }

  .irs--round .irs-single:before{
    border-top-color: #FF4000;
    /* left: 30%; */
  }

  .irs-single{
    top: -30px;
  }

  .irs--round .irs-line {
    height: 10px;
  }

  .irs--big .irs-grid-pol{
    background-color: #FF4000;
    /* height: 20px; */
  }

  .irs--round .irs-grid-text{
    font-size: 20px;
    top: 25px;
  }

  .irs--round .irs-grid-pol{
    height: 20px;
  }
  </style>


</body>
</html>
