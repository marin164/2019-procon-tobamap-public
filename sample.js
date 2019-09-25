var mapPosition={lat: 34.48233, lng: 136.824137};



//スライダー
(function(){
var slider = document.getElementById('slider1');
var output = document.getElementById('slider1o');

var input = slider.getElementsByTagName('input')[0];
var root = document.documentElement;
var dragging = false;
var value = output.value;// 初期位置
var width = input.clientWidth / 2;

var set_value = function (){
  // つまみのサイズ(input.clientWidth)だけ位置を調整
  input.style.left = (value - input.clientWidth/2) + 'px';
  output.value = value;
};
set_value();

// 目盛り部分をクリックしたとき
slider.onclick = function(evt){
  dragging = true;
  document.onmousemove(evt);
  document.onmouseup();
};
// ドラッグ開始
input.onmousedown = function(evt){
  dragging = true;
  return false;
};
// ドラッグ終了
document.onmouseup = function(evt){
  if (dragging) {
    dragging = false;
    output.value = value;
  }
};
document.onmousemove = function(evt){
  if(dragging){
    // ドラッグ途中
    if(!evt){
      evt = window.event;
    }
    var left = evt.clientX;
    var rect = slider.getBoundingClientRect();
    // マウス座標とスライダーの位置関係で値を決める
    value = Math.round(left - rect.left - width);
    // スライダーからはみ出したとき
    if (value < 0) {
      value = 0;
    } else if (value > slider.clientWidth) {
      value = slider.clientWidth;
    }
    set_value();
    return false;
  }
};
})();





// データの準備
var heatmapData = [
  new google.maps.LatLng(34.48233, 136.824137),
  {location: new google.maps.LatLng(34.48233, 136.824137), weight: 8},
  {location: new google.maps.LatLng(34.4821, 136.828), weight: 5}
];

// Mapオブジェクトの初期化
var mapArea = document.getElementById('maps');

var mapOptions ={
  center: mapPosition,
  zoom: 16,
};

// ヒートマップレイヤの初期化
var heatmap = new google.maps.visualization.HeatmapLayer({data: heatmapData});



//マーカーを立てる
var map = new google.maps.Map(mapArea,mapOptions);
marker = new google.maps.Marker({
    // position: new google.maps.LatLng(35.659657, 139.698764),
  position: mapPosition,
    map: map
});
 marker.setMap(map);

 // ヒートマップをmapインスタンスに紐付け
 heatmap.setMap(map);
