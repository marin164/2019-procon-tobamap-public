var today = new Date();
var year = today.getFullYear()
var count = [];

// 住民の年代が決まっているボタン
// もう少しスマートにできないかな
// $('#baby').on('click',function(){
//   var top = year-3;
//   var under = year;
//   age(under,top);
// });
// $('#infant').on('click',function(){
//   var top = year-6;
//   var under = year-4;
//   age(under,top);
// });
// $('#elementary_school').on('click',function(){
//   var top = year-12;
//   var under = year-7;
//   age(under,top);
// });
// $('#middle_school').on('click',function(){
//   var top = year-15;
//   var under = year-13;
//   age(under,top);
// });
// $('#high_school').on('click',function(){
//   var top = year-18;
//   var under = year-16;
//   age(under,top);
// });
// $('#adult').on('click',function(){
//   var top = year-19;
//   var under = year-64;
//   age(under,top);
// });
// $('#senior').on('click',function(){
//   var top = year-100;
//   var under = year-65;
//   age(under,top);
// });



//  function agefunc( obj ) {
//
//   if( obj.checked ){
//     var top = year-3;
//     var under = year;
//     age(under,top);
//     count = PlotArray;
//   }
//   else {
//       MarkersArray.push(PlotArray);
//       PlotArray = [];
//
//       for(var i=0; i<count.length; i++){
//         PlotArray.push(count[i]);
//       }
//
//       console.log(MarkersArray);
//       console.log(PlotArray);
//        for(var i=0; i<PlotArray.length; i++){
//           PlotArray[i]["marker"].setVisible(false);
//       }
//   }
//  }



var age_flag = false;
//全選択をチェックしたら全部にチェックする
function myfunc() {
  console.log("IN");
    // チェックボックスの数
    var count = document.age_form.age.length;

    if(age_flag == false){
      age_flag = true;
       // console.log(ElementsCount);
      for( i=0 ; i<count ; i++ ) {
         document.age_form.age[i].checked = age_flag; // ON・OFFを切り替え
      }
    }
    else{
      age_flag = false;
      for( i=0 ; i<count ; i++ ) {
         document.age_form.age[i].checked = age_flag; // ON・OFFを切り替え
      }
    }
    agefunc();
}




// Ajax button click
$('#age_search').on('click',function(){

  if (document.getElementById('age_top').value == "" || document.getElementById('age_under').value == "")  {
      alert('数字を入力してください');
  }
  else{
    // var today = new Date();
    // var year = today.getFullYear()
    console.log(year);
    var age_top = year -  $('#age_top').val();
    var age_under = year - $('#age_under').val();

    console.log(age_top);
    console.log(age_under);

    age(age_top, age_under);
  }

});


function age(age_top, age_under){

      $.ajax({
          url:'./request.php',
          type:'POST',
          data:{
              'age_top':age_top,
              'age_under':age_under
          }
      })
      // Ajaxリクエストが成功した時発動
      .done( (data) => {
          $('.result').html(data);
          // console.log(data);

          //jQueryを利用してカスタムデータ属性にアクセス
          var $script = $('#sample');
          residents = JSON.parse($script.attr('data-json-test'));
          count_address=residents.length;

            // console.log(residents);
            console.log(count_address);
            var color = "#FF0000";

            Plot(residents,count_address,color);
      })
      // Ajaxリクエストが失敗した時発動
      .fail( (data) => {
          // $('.result').html(data);
          console.log(data);
      })
}
