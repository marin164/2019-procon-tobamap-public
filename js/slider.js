// 年代スライダー
//type="range"要素に対して適応
	// $('input[type="range"]').rangeslider();
	//破棄する場合は以下
	// $('input[type="range"]').rangeslider('destroy');



  $("#slider").ionRangeSlider({
          type: 'single',
          skin: "round",
          //  メモリ設定

          grid: true,
          min: 1990,
          max: 2090,
          from: 2019,
          step: 1,
          onFinish: function (data) {
              var slider_num = data.from;
              console.log(slider_num);
              slider_change(slider_num);
          },
        });


//津波スライダー
    // var custom_values = [0,1,2,3,4,5,6,7,8,9,10];

     // be careful! FROM and TO should be index of values array
     // var my_from = custom_values.indexOf(0);
     // var my_to = custom_values.indexOf(10);

     $("#demo_5").ionRangeSlider({
         type: 'single',
         skin: "round",
         step: 1,
         grid: true,
         // from: my_from,
         // to: my_to,
         min: 0,
         max: 5,
         from: 0,
         values:[0,3,5,10,15,20],
         // values: custom_values,
         postfix: "", //吹き出し
         onFinish: function (){ drawTsunami($("#demo_5").val())},
     });
