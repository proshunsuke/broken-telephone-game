{ // 現在時刻の表示

    let timeLoop = function(){
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
    };

    var showTheTime = {

        init: function(){
            setTimeout(function(){
                showTheTime.init();
                timeLoop();
            },1000);
        }
    };
}