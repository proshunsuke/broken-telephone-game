window.onload = function(){
    var insertpagename = "<li class='active' id='paint'><a href='/paint'>Paint</a></li>";
    $('#nav-ul').append(insertpagename);

    toInstance_init();
    show_the_time();


}

// 現在時刻の表示
function show_the_time(){
    var Jikan = new Date();
    var Hour = Jikan.getHours();
    var Minute = Jikan.getMinutes();
    var Second = Jikan.getSeconds();
    if(Minute < 10){
        Minute = "0" + Minute;
    }
    if(Second < 10){
        Second = "0" + Second;
    }
    $('#thetime').html(Hour + ":" + Minute + ":" + Second);
    setTimeout("show_the_time()",1000);
}

