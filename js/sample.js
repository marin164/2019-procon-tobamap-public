var map;
var array;
var lat;
var lng;
var address = [];

//jQueryを利用してカスタムデータ属性にアクセス
// var $script = $('#script');
// var residents = JSON.parse($script.attr('data-json-test'));
// var count_address=residents.length;
//
//   console.log(residents);

      // Ajax button click
      $('#age_search').on('click',function(){
          $.ajax({
              url:'./request.php',
              type:'POST',
              data:{
                  'age_top':$('#age_top').val(),
                  'age_under':$('#age_under').val()
              }
          })
          // Ajaxリクエストが成功した時発動
          .done( (data) => {
              $('.result').html(data);
              console.log(data);

          })
          // Ajaxリクエストが失敗した時発動
          .fail( (data) => {
              $('.result').html(data);
              console.log(data);
          })
          // Ajaxリクエストが成功・失敗どちらでも発動
          .always( (data) => {

          });
      });





  // モーダルウィンドウ
  $(function(){
    //テキストリンクをクリックしたら
   $("#modal-open").click(function(){
        //body内の最後に<div id="modal-bg"></div>を挿入
       $("body").append('<div id="modal-bg"></div>');
      //画面中央を計算する関数を実行
      modalResize();

      //モーダルウィンドウを表示
          $("#modal-bg,#modal-main").fadeIn("slow");

      //画面のどこかをクリックしたらモーダルを閉じる
        $("#modal-bg,#modal-close").click(function(){
            $("#modal-bg,#modal-main").fadeOut("slow",function(){
           //挿入した<div id="modal-bg"></div>を削除
                $('#modal-bg').remove() ;
           });

          });

      //画面の左上からmodal-mainの横幅・高さを引き、その値を2で割ると画面中央の位置が計算できます
       $(window).resize(modalResize);
        function modalResize(){

              var w = $(window).width();
            var h = $(window).height();

              var cw = $("#modal-main").outerWidth();
             var ch = $("#modal-main").outerHeight();

          //取得した値をcssに追加する
              $("#modal-main").css({
                  "left": ((w - cw)/2) + "px",
                  "top": ((h - ch)/2) + "px"
            });
       }
     });
  });




function initMap() {
		'use strict';

// 基本設定
		var mapPosition={lat: 34.477731, lng: 136.863023};
		var mapArea = document.getElementById('map');
		var mapOptions ={
			center: mapPosition,
			zoom: 14,

		// googlemapのコントロールボタンの位置変更
		mapTypeControlOptions: {
		      position: google.maps.ControlPosition.BOTTOM_LEFT
		    }

		};
       map = new google.maps.Map(mapArea,mapOptions);
   }

   // 地域の名前を消す
		// var style = [{
		//     featureType: 'all',
		//     elementType: 'labels',
		//     stylers: [{ visibility: 'off' }]
		//   }];
		//   var lopanType = new google.maps.StyledMapType(style);
		//   map.mapTypes.set('noText', lopanType);
		//   map.setMapTypeId('noText');


document.getElementById("age_search").onclick = function(){


  console.log("hello");

			var info_residents=[];
			var i=0;
      var check1 = false;
		  check1 = document.form1.age_check.checked;


	     if (check1 == true) {
			  console.log("true");

			  residents.forEach( function( value ) {

					info_residents[i] = value.address;
          i++;

				});
        // console.log(info_residents);
				attrLatLngFromAddress(info_residents);

	        } else {
			  console.log("false");
        function ClearAllIcon() {
        MarkerArray.forEach(function (marker, idx) { marker.setMap(null); });
      }

	        }

		};



// 住所から緯度経度を取ってくる
    function attrLatLngFromAddress(info_array)
    {

      console.log(info_array);
        var geocoder = new google.maps.Geocoder();

      for (var i = 0; i < count_address; i++){

        // console.log(i);

        geocoder.geocode({'address': info_array[i]}, function(results, status){
          if(status === google.maps.GeocoderStatus.OK) {
								 lat = results[0].geometry.location.lat();
								 lng = results[0].geometry.location.lng();

								console.log(lat);
								console.log(lng);

                // LatLng(lat,lng);

                address.push({ lat: lat, lng: lng });

      }
      });
      // console.log(i);
      //オブジェクトを配列の中に追加する
    }
    console.log(address);
    PlotIcon(address);

}

function PlotIcon(address) {
  // console.log(address);
  address.forEach(function( value ) {
       // console.log( value.lat );
       // console.log( value.lng );
       console.log("hello");
  });

  var MarkerArray = new google.maps.MVCArray(); // marker変数
      // var image = '/res/icon.png';
      //ここにforeachを入れてマーカーをセットする

      var myLatLng = new google.maps.LatLng(lat,lng);
      var Marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
      });
      MarskerArray.push(Marker);
}
