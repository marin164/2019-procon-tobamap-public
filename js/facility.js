//グローバル変数
var school_flag = false; //学校教育施設
var society_flag = false; //社会教育施設
var refuse_flag = false; //ごみ処理施設
var welfare_flag = false; //福祉施設
var medical_flag = false; //医療施設
var tourism_flag = false; //観光施設
var traffic_flag = false; //公共交通機関
var warehouse_flag = false; //倉庫
var fire_and_police_flag = false; //消防・警察署
var public_flag = false; //役所関連
var housing_complex_flag = false; //団地
var old_publick_flag = false; //旧公共施設





//学校教育施設がチェックされたら子要素を全てプロットする
$('#society').on('click',function(){
    // チェックボックスの数
    var count = document.society_form.check.length;

    if(society_flag == false){
      society_flag = true;
       // console.log(ElementsCount);
      for( i=0 ; i<count ; i++ ) {
         document.society_form.check[i].checked = society_flag; // ON・OFFを切り替え
      }
    }
    else{
      society_flag = false;
      for( i=0 ; i<count ; i++ ) {
         document.society_form.check[i].checked = society_flag; // ON・OFFを切り替え
      }
    }
    //AllCheck();
});//社会教育施設



$('#school').on('click',function(){
    // チェックボックスの数
    var count = document.school_form.check.length;

    if(school_flag == false){
      school_flag = true;
       // console.log(ElementsCount);
      for( i=0 ; i<count ; i++ ) {
         document.school_form.check[i].checked = school_flag; // ON・OFFを切り替え
      }
    }
    else{
      school_flag = false;
      for( i=0 ; i<count ; i++ ) {
         document.school_form.check[i].checked = school_flag; // ON・OFFを切り替え
      }
    }
    //AllCheck();
});//学校教育施設



function AllCheck(){
  //チェックされた項目を記録する変数
  var str="";
  var count = document.all_facility.check.length;
  console.log(count);

//ここをいじって全てのチェックボックスから
//チェックされているものを調べる

  //for文でチェックボックスを１つずつ確認
  for( i=0; i<6; i++ )
  {
    //チェックされているか確認する
    if( document.chbox.elements[i].checked )
    {
      //変数strが空でない時、区切りのコンマを入れる
      if( str != "" ) str=str+",";

      //チェックボックスのvalue値を変数strに入れる
      str=str+document.chbox.elements[i].value;
    }
  }

}
