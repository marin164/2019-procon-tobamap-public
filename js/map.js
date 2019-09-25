//グローバル変数
var map;
//全住民、公共施設が入った配列
var residents = [];
var facility = [];
//checkのflag配列
var check = [];
//今年の年を取得
var today = new Date();
var year = today.getFullYear()
//Plotされるデータが入る配列
var PlotArray = [];
//Plotされている住民のみの配列
var Residents_array = [];
//Plotされている公共施設のみの配列
var Facility_array = [];
//選択されているcity
var select_city;
//バスルート
var result;
var route;
//住居
var geocoding;
//地図の拡大比率
var level;
//拡大した時の家族をカウントする
var citizen_num=[];
//公共施設の細かいジャンル
var detail;
//住居だけの配列
var House_array = [];

//あとで消す
var marker;
var mapPosition;


window.onload = function () {
    initMap();
    // default_setting();
}


function default_setting(){
  $('#baby').prop('checked', true);
  change(1);
  $('#city_1').prop('checked', true);
  // $('.city_1').prop('checked', true);
  all_checkbox();
}

// googleMap
function initMap() {
		'use strict';
// 基本設定
		 mapPosition = {lat: 34.480445, lng: 136.839438};
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

       //mapのズーム値を取得
       google.maps.event.addListener(map, 'zoom_changed', function() {
          dispLevel(map.getZoom());
          // level = map.getZoom();
        });


       //  marker = new google.maps.Marker({ // マーカーの追加
       //      position: mapPosition, // マーカーを立てる位置を指定
       //      map: map // マーカーを立てる地図を指定
       // });

}



//一定以上ズームされたら吹き出しを表示
function dispLevel(level) {
  citizen_num =[];
  console.log(level);
  var infoWindow;
  var content;
  // console.log(PlotArray[2-1]['address']);

  if(level >=20){
    for(var i=0; i<House_array.length; i++){
      console.log("IN");

        var potision = {lat: Number(House_array[i]['lat']), lng: Number(House_array[i]['lng'])};
        var marker = new google.maps.Marker({ // マーカーの追加
            position: potision, // マーカーを立てる位置を指定
            map: map, // マーカーを立てる地図を指定
            icon: {
         		fillColor: "#FFFFFF",   //塗り潰し色
         		fillOpacity: 0,                    //塗り潰し透過率
           	path: google.maps.SymbolPath.CIRCLE, //円を指定
         		scale: 1,                           //円のサイズ
           	strokeColor: "#FFFFFF",              //枠の色
             strokeWeight: 0                    //枠の透過率
           	}
         });

         //配列の一番最後
        if(i==House_array.length-1){
          if(House_array[i]['address']== House_array[i-1]['address']){
            citizen_num.push(House_array[i]['age']);

             infoWindow = new google.maps.InfoWindow({
                content: '<div>'+citizen_num.length+'</div>'
            });
          }else{
             infoWindow = new google.maps.InfoWindow({
                content: '<div>'+citizen_num.length+'</div>'
            });
          }
        }
        //一つ先と同じaddressだった時
        else if(House_array[i]['address']== House_array[i+1]['address']){
          citizen_num.push(House_array[i]['age']);
        }
        //addressが被らなかった
        else{

          citizen_num.push(House_array[i]['age']);
          // console.log(citizen_num);
          // for(var l=0; l<citizen_num.length; l++){
          //   content =
          // }

          infoWindow = new google.maps.InfoWindow({
               content: '<div>'+citizen_num.length+'</div>'
           });
          infoWindow.open(map, marker); // 吹き出しの表示


          citizen_num = [];

      }
  　}
  }
}  //dispLevel終了





//phpからの受け取り
function db(){
  var $script = $('#sample');
  area = JSON.parse($script.attr('data-json-test'));
  // var count_area=area.length;
  // console.log(area);

  var $script2 = $('#sample2');
  facility = JSON.parse($script2.attr('data-json-test2'));
  // var count_facility=facility.length;
  // console.log(facility);

  var $script3 = $('#sample3');
  city = JSON.parse($script3.attr('data-json-test3'));
  for(var i=0; i<city.length; i++){
    city[i]['flag'] = false;
  }
  console.log(city);

  var $script4 = $('#sample4');
  association = JSON.parse($script4.attr('data-json-test4'));
  for(var i=0; i<association.length; i++){
    association[i]['flag'] = false;
  }
  // console.log(association);

  var $script5 = $('#sample5');
  residents = JSON.parse($script5.attr('data-json-test5'));
  console.log(residents);

  var $script6 = $('#sample6');
  residents_setting = JSON.parse($script6.attr('data-json-test6'));
  // console.log(residents_setting);

  var $script7 = $('#sample7');
  result = JSON.parse($script7.attr('data-json-test7'));
  // console.log(result);

  var $script8 = $('#sample8');
  detail = JSON.parse($script8.attr('data-json-test8'));
  for(var i=0; i<detail.length; i++){
    detail[i]['flag'] = false;
  }
  // console.log(detail);
}




//全選択
//年代分け
function residentfunc() {
    $('.resident').prop("checked", $('#all_resident').prop("checked"));
    all_checkbox();
  }



//全地区の表示
function tikufunc() {

    var flag = $('#all_tiku').prop("checked");
    for(var i=0; i<association.length; i++){
      association[i]['flag'] = flag;
    }
    change(1);
    $('.tiku').prop("checked", $('#all_tiku').prop("checked"));
  }

//一つでもチェックが外れたら全選択を外す
function delete_tiku(){
    $('#all_tiku').prop("checked",false);
}

//地区をチェック、町を全チェック
function areafunc(id) {
    delete_tiku();
    change(id);

    $('.city'+id).prop("checked", $('#area_'+id).prop("checked"));

    //cityのflagチェンジ
    var flag = $('#area_'+id).prop("checked");

    for(var i=0; i<city.length; i++){
      if(id==city[i]['area_id']){
          city[i]['flag'] = flag;
      }
    }
    console.log(city);
    all_checkbox();
  }

//町をチェック、自治会を全チェック
function cityfunc(id) {

    var flag = $('#city_'+id).prop("checked");

    for(var i=0; i<city.length; i++){
      if(id == city[i]['id']){
        city[i]['flag'] = flag;
      }
    }
    console.log(city);
    all_checkbox();
  }

//町がチェックされて自治会を表示する
function change(a_id){

    $('#city_detail').empty();
    var city_box = document.getElementById('city_detail');

    for(var i=0; i<city.length; i++){
      if(a_id==city[i]['area_id'] && city[i]['flag']==true){
        city_box.insertAdjacentHTML('beforeend', '<input id="city_'+city[i]['id']+'" class="tiku city'+city[i]['area_id']+'" type="checkbox" onchange="cityfunc('+city[i]['id']+')" checked/>'+'<a>'+city[i]['name']+'</a>'+'<br>');
      }else if(a_id==city[i]['area_id'] && city[i]['flag']==false){
        city_box.insertAdjacentHTML('beforeend', '<input id="city_'+city[i]['id']+'" class="tiku city'+city[i]['area_id']+'" type="checkbox" onchange="cityfunc('+city[i]['id']+')" />'+'<a>'+city[i]['name']+'</a>'+'<br>');
      }
    }
  }


//細かいジャンルを一括チェックする
function facility_func(id){
    facility_change(id);

    $('.class'+id).prop("checked", $('#class_'+id).prop("checked"));

    //cityのflagチェンジ
    var flag = $('#class_'+id).prop("checked");

    for(var i=0; i<detail.length; i++){
      if(id==detail[i]['parent_class_id']){
          detail[i]['flag'] = flag;
      }
    }
    console.log(detail);
    all_checkbox();
}

//細かいジャンルをチェックする
function facility_check(id){
    var flag = $('#detail_'+id).prop("checked");

    for(var i=0; i<detail.length; i++){
      if(id == detail[i]['id']){
        detail[i]['flag'] = flag;
      }
    }
    console.log(detail);
    all_checkbox();
}

//公共施設のclassがチェックされdetailを表示
function facility_change(id){
    console.log(id);

    $('#facility_detail').empty();
    var facility_box = document.getElementById('facility_detail');

    for(var i=0; i<detail.length; i++){
      if(id==detail[i]['parent_class_id'] && detail[i]['flag']==true){
        facility_box.insertAdjacentHTML('beforeend', '<input id="detail_'+detail[i]['id']+'" class="facility class'+detail[i]['parent_class_id']+'" value="'+detail[i]['id']+'" name="check_child" type="checkbox" onchange="facility_check('+detail[i]['id']+')" checked/>'+'<a>'+detail[i]['name']+'</a>'+'<br>');
      }
      else if(id==detail[i]['parent_class_id'] && detail[i]['flag']==false){
        facility_box.insertAdjacentHTML('beforeend', '<input id="detail_'+detail[i]['id']+'" class="facility class'+detail[i]['parent_class_id']+'" value="'+detail[i]['id']+'" name="check_child" type="checkbox" onchange="facility_check('+detail[i]['id']+')" />'+'<a>'+detail[i]['name']+'</a>'+'<br>');
      }
    }
}




//checkboxで選択されているものを取得
//識別関数に送り込む
function all_checkbox(){
  var checkbox_num = document.check.check_child.length;
  var check_flag = [];


  Visible(PlotArray);
  PlotArray = [];
  Residents_array = [];
  Facility_array = [[],[],[],[],[],[],[],[],[],[],[],
                    [],[],[],[],[],[],[],[],[],[],
                    [],[],[],[],[],[],[],[],[],[],
                    [],[],[],[],[],[],[],[],[],[]
                   ];


  for(var i=0; i<checkbox_num; i++){

      check_flag[i] = document.check.check_child[i].checked;
      // var type = document.check.check_child[i].className;
      var type = document.check.check_child[i].className.split(" ")[0];
      console.log(type);


      //住民がチェックされた
        if (check_flag[i] == true && type == "resident") {
              var top = year-residents_setting[i]['age_top'];
              var under = year-residents_setting[i]['age_under'];
              selected_age(top,under,i);
        }
        //年齢が入力された
        else if(check_flag[i] == true && type== "age_input"){
              var top = year -  $('#age_top').val();
              var under = year - $('#age_under').val();
              selected_age(top, under,i);
        }
        //公共施設がチェックされた
        else if(check_flag[i] == true && type == "facility"){

          //detail.id
          var select_facility = document.check.check_child[i].value;
          console.log(select_facility);

          for(var l=0; l<facility.length; l++){
              var id = facility[l]['detailed_class_id'];
              if(select_facility == id){
                //facility[l]['marker_color'] = "#FC6E51";
                let marker = new Marker({
                  position: {lat:Number(facility[l].lat),lng:Number(facility[l].lng)},
                  map: map,
                  icon: "http://maps.google.co.jp/mapfiles/ms/icons/red-dot.png",
                  draggable: true
                });
                marker.currentData = {count:0,evacuee:[]};
                marker.name = facility[l].name;
                Facility_array[i].push(marker);

              }
           }
           Residents_array.map(function(o){
             let shelterIndex = fetchIndexOfNearShelter(o,Facility_array[i]);
             Facility_array[i][shelterIndex].currentData.count++;
             Facility_array[i][shelterIndex].currentData.evacuee.push(o);
           });
           console.log(Facility_array);
           Facility_array[i].map(function(o,ind){
             o.showInfoWindow(o.name,"利用者見込み数 : "+o.currentData.count+"人"+"<div id='" + o.name + "' style='width: 180px; height: 255px;'><img src='chart.png' style='width: 180px; height: 255px;'></div>",1,function(){
               Facility_array[i][ind].currentData.evacuee.map(function(ob){
                   if(shelterArray[i][ind].state === 1){
                     ob.marker.icon.strokeColor = "#ffffff";
                     ob.marker.setMap(null);
                     ob.marker.setMap(map);
                   }else if(shelterArray[i][ind].state === 2){
                     ob.marker.icon.strokeColor = "#000";
                     ob.marker.setMap(null);
                     ob.marker.setMap(map);
                   }
               });
               showChart(o.name,separateData(o.currentData.evacuee));
             });
           });

        }
        //住居がチェックされた
        else if(check_flag[i] == true && type == "occupied"){
            // for(var i=0; i<residents.length; i++){
            //   if(residents[i]['occupied'] == 1){
            //     residents[i]['marker_color'] = "#F6BB42";
            //     PlotArray.push(residents[i]);
            //     House_array.push(residents[i]);
            //   }
            // }

            for(var i=0; i<residents.length; i++){
              for(var l=0; l<city.length; l++){
              // for(var l=0; l<100; l++){
                if(city[l]['flag'] == true){
                  var flag = city[l]['id']

                  if(residents[i]['occupied'] == 1 && flag == residents[i]['city_id']){
                    residents[i]['marker_color'] = "#F6BB42";
                    PlotArray.push(residents[i]);
                    House_array.push(residents[i]);
                  }

                }
              }
            }
        }
        //空き家がチェックされた
        else if(check_flag[i] == true && type == "unoccupied"){
            for(var i=0; i<residents.length; i++){
              if(residents[i]['occupied'] == 0){
                residents[i]['marker_color'] = "#434A54";
                PlotArray.push(residents[i]);
              }
            }
        }
  }

  console.log(PlotArray);
  console.log(House_array);
  Plot(PlotArray);
}




//年代ごとにマーカーの色をつけている
function selected_age(top,under,i){

    for(var l=0; l<residents.length; l++){
      for(var i=0; i<city.length; i++){
        if(city[i]['flag']==true){

          var select_city = city[i]['id'];

          if(residents[l]['age']<=top && residents[l]['age']>=under && residents[l]['city_id']==1 )
          // if(residents[l]['age']<=top && residents[l]['age']>=under )
          {
            // console.log(residents[l]['city_id'],select_city);
            if(residents[l]['city_id'] == select_city){
              if(residents[l]['sex'] == '男'){
                residents[l]['marker_color'] = residents_setting[i]['marker_color_m'];
              }else{
                residents[l]['marker_color'] = residents_setting[i]['marker_color_f'];
              }
              PlotArray.push(residents[l]);
              Residents_array.push(residents[l]);
            }
          }

        }
      }
    }
}



function slider_change(change_num){

  var num = change_num-year;
  year = change_num;
  console.log(num);

  all_checkbox();

}



//マップ上のマーカーを非表示にする
function Visible(array){
  if(array.length>0){
      for(var i=0; i<array.length; i++){
         array[i]['marker'].setVisible(false);
     }
  }
}



// map上にプロットしていく
function Plot(array) {

    for (var i = 0; i < array.length; i++) {

     var lat = Number(array[i]['lat']);
     var lng = Number(array[i]['lng']);

     var markerLatLng = {lat: lat, lng: lng};
     if (!array[i]['detailed_class_id']){
       var marker = new google.maps.Marker({
       position: markerLatLng,
       map: map,
       icon: {
    		fillColor: array[i]['marker_color'],   //塗り潰し色
    		fillOpacity: 0.8,                    //塗り潰し透過率
      	path: google.maps.SymbolPath.CIRCLE, //円を指定
    		scale: 8,                           //円のサイズ
      	strokeColor: "#FFFFFF",              //枠の色
        strokeWeight: 0.8                    //枠の透過率
      	}
        });
        array[i]['marker'] = marker;
      }
    }
    console.log(array);
 }//Plot関数終了

var routeArray = [];
//バスルートの表示
function busfunc(id){

  //バスルートがチェックされた
  if ($("#bus_route"+id).prop("checked") == true) {
        console.log(id);
        route = [];
        var interim_array = [];

        for(var i=0; i<result.length; i++){
          if(id==i){

            interim_array.push(result[i]['route']);
            console.log(interim_array);

            for(var l=0; l<interim_array[0].length; l++){
                interim_array[0][l]['marker_color'] = "#967ADC";
                route.push(interim_array[0][l]);
            }
          }
        }

        for(var l=0; l<route.length; l++){
            let marker = new Marker({
              position: {lat:Number(route[l].lat),lng:Number(route[l].lng)},
              map: map,
              icon: "http://maps.google.co.jp/mapfiles/ms/icons/purple-dot.png",
              draggable: true
              });
              marker.currentData = {count:0,evacuee:[]};
              marker.name = route[l].name;
              routeArray.push(marker);
         }
         Residents_array.map(function(o){
           let shelterIndex = fetchIndexOfNearShelter(o,routeArray);
           routeArray[i][shelterIndex].currentData.count++;
           routeArray[i][shelterIndex].currentData.evacuee.push(o);
         });
         routeArray.map(function(o,ind){
           o.showInfoWindow(o.name,"利用者見込み数 : "+o.currentData.count+"人"+"<div id='" + o.name + "' style='width: 180px; height: 255px;'><img src='chart.png' style='width: 180px; height: 255px;'></div>",1,function(){
             routeArray[ind].currentData.evacuee.map(function(ob){
                 if(routeArray[ind].state === 1){
                   ob.marker.icon.strokeColor = "#ffffff";
                   ob.marker.setMap(null);
                   ob.marker.setMap(map);
                 }else if(routeArray[ind].state === 2){
                   ob.marker.icon.strokeColor = "#000";
                   ob.marker.setMap(null);
                   ob.marker.setMap(map);
                 }
             });
             showChart(o.name,separateData(o.currentData.evacuee));
           });
         });
        console.log(route);
      } else {
        Visible(route);
      }
}





$('input[type="checkbox"]').change(function(e) {

  var checked = $(this).prop("checked"),
      container = $(this).parent(),
      siblings = container.siblings();

  container.find('input[type="checkbox"]').prop({
    indeterminate: false,
    checked: checked
  });

  function checkSiblings(el) {

    var parent = el.parent().parent(),
        all = true;

    el.siblings().each(function() {
      let returnValue = all = ($(this).children('input[type="checkbox"]').prop("checked") === checked);
      return returnValue;
    });

    if (all && checked) {

      parent.children('input[type="checkbox"]').prop({
        indeterminate: false,
        checked: checked
      });

      checkSiblings(parent);

    } else if (all && !checked) {

      parent.children('input[type="checkbox"]').prop("checked", checked);
      parent.children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
      checkSiblings(parent);

    } else {

      el.parents("li").children('input[type="checkbox"]').prop({
        indeterminate: true,
        checked: false
      });

    }

  }

  checkSiblings(container);
});
