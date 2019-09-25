<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
<title>TobaMap(公開ページ)</title>
<script src="https://maps.googleapis.com/maps/api/js?key=APIKEY&callback=initMap" async></script>


<!-- <script src="takahashi/js/kmeans.js"></script> -->
<!-- cssファイル -->
<link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/facility.css">
<link rel="stylesheet" type="text/css" href="css/slider.css">


</head>


<body>
     <div id="map" style="width:100%;height:100%"></div>

     <script>
     let map;
     function initMap(){
        'use strict';
        const mapPosition={lat: 34.480445, lng: 136.839438};
        let mapArea = document.getElementById('map');
        let mapOptions =　{
             center: mapPosition,
             zoom: 15,
             mapTypeControl: false,
             zoomControlOptions: {
                  position: google.maps.ControlPosition.LEFT_TOP
             },
             streetViewControlOptions: {
                  position: google.maps.ControlPosition.LEFT_TOP
             }
         };
         map = new google.maps.Map(mapArea,mapOptions);
     }

     </script>

</body>
</html>
