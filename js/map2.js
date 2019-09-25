//グローバル変数
var map;
//全住民、公共施設が入った配列
var residents = [];
var facility = [];
//checkのflag配列
var check = [];

window.onload = function () {
    initMap();
<<<<<<< HEAD
}


// googleMap
function initMap() {
		'use strict';
// 基本設定
		var mapPosition={lat: 34.480445, lng: 136.839438};
		var mapArea = document.getElementById('map');
		var mapOptions ={
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
       // db();
}


  //全住民データを持ってくる
  //全公共施設のデータを持ってくる
function db(){
      var residents = "residents";

      $.ajax({
         url:'./request2.php',
         type:'POST',
         data:{
             'residents':residents,
         }
     })
     // Ajaxリクエストが成功した時発動
     .done( (data) => {
       $('.result').html(data);
         //jQueryを利用してカスタムデータ属性にアクセス
         //全住民
         var $script = $('#sample');
         residents = JSON.parse($script.attr('data-json-test'));
         var count_residents=residents.length;

         console.log(residents);

         //全公共施設
         var $script2 = $('#sample2');
         facility = JSON.parse($script2.attr('data-json-test2'));
         var count_facility=facility.length;

         console.log(facility);

     })
     // Ajaxリクエストが失敗した時発動
     .fail( (data) => {
         // $('.result').html(data);
         console.log("miss");
     })
}

=======
}


// googleMap
function initMap() {
		'use strict';
// 基本設定
		var mapPosition={lat: 34.480445, lng: 136.839438};
		var mapArea = document.getElementById('map');
		var mapOptions ={
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
       db();
}


//全公共施設

function db(){
  var $script = $('#sample');
  area = JSON.parse($script.attr('data-json-test'));
  var count_area=area.length;
  console.log(area);

  var $script2 = $('#sample2');
  facility = JSON.parse($script2.attr('data-json-test2'));
  var count_facility=facility.length;
  console.log(facility);

  var $script3 = $('#sample3');
  city = JSON.parse($script3.attr('data-json-test3'));
  console.log(city);

  var $script4 = $('#sample4');
  town = JSON.parse($script4.attr('data-json-test4'));
  console.log(town);

  var $script5 = $('#sample5');
  residents = JSON.parse($script5.attr('data-json-test5'));
  console.log(residents);
}


>>>>>>> dev-kamaya


//checkboxで選択されているものを取得
//識別関数に送り込む
function agefunc() {
  var txt = [];
<<<<<<< HEAD

  for(var i=0; i<7; i++){
    check[i] = document.age_form.age[i].checked;
    console.log(check[i]);

    if (check[i] == true) {
      console.log("checkされています");

      for(var l=0; l<7; l++){
          txt[i] = document.age_form.age[i].value;
      }
    } else {
      console.log("checkされていないです");
    }
  }
  console.log(txt);
  }
=======
  var l=0;

  for(var i=0; i<7; i++){
    check[i] = document.age_form.age[i].checked;
    // console.log(check[i]);

    if (check[i] == true) {
      // console.log("checkされています")
          txt[l] = document.age_form.age[i].value;
          l++;
    } else {
      // console.log("checkされていないです");
    }
  }
  console.log(txt);
  }
>>>>>>> dev-kamaya
