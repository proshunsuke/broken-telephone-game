function Game(){
    this._isHost;
    this._isStart;
    this._drawtime;
    this._draw_start_Date; // 現在描いている人の描きはじめた時刻
    //this._game_start_Date; // ゲームが始まった時刻
    this._img_list;

    this.wait;
    this.setting;
    this.gaming;
    this.finish;

    this.init = function(){
        this._isHost = false;
        this._isStart = false;
        this._drawtime = 120;
        this._draw_start_Date = new Date();
        this._game_start_Date = new Date();
        this._img_list = new Oekaki_list();

        this._mode.wait = true;
        this._mode.setting = false;
        this._mode.gaming = false;
        this._mode.finish = false;

    }

    this._mode = function(){
        this.wait;
        this.setting;
        this.gaming;
        this.finish;
    }

    this.change_mode = function(mode,username){
        for(var i in this._mode){
            this._mode[i] = false;
        }
        this._mode[mode] = true;

        var modetext;
        if(this._mode.wait){
            modetext = "待機中";
        }else if(this._mode.setting){
            modetext = username + "さんが設定中です";
        }else if(this._mode.gaming){
            modetext = "ゲーム中";
        }else if(this._mode.finish){
            modetext = "ゲーム終了";
        }
        $('#mode').html(modetext);
        b_chat.write_comment(modetext);

        //デバッグ
        // for(var i in this._mode){
        //     console.log("b_game._mode[",i,"]:",this._mode[i]);
        // }
    }

    this.change_finish_time = function(Hour,Minute){
        var finishtimetext;
        if(this._mode.wait){
            finishtimetext = "終了予定：";
        }else{
            finishtimetext = "終了予定：" + Hour + "時" + Minute + "分";
        }
        $('#finishtime').html(finishtimetext);
    }

    this.change_userlist_label = function(){
        if(b_game._mode.gaming || b_game._mode.finish){
            $('#userslist').html('描く順番');
        }else if(b_game._mode.wait || b_game._mode.setting){
            $('#userslist').html('ログイン中のユーザ');
        }
    }

    // 描いている人の状況
    this.change_drawing = function(draw_user){
        var drawingtext;
        if(draw_user == "none"){
            drawingtext = '誰も描いていません';
        }else if(draw_user == b_user._user){
            drawingtext = 'あなたの番です';
            b_audios_start.play();
            $('#startdraw').css({"visibility":"visible"});
            $('.progress .bar').css('width:100%');
            this.timelimit(b_game._drawtime);
        }else{
            drawingtext = draw_user + ' さんが描いています';
        }
        $('#drawing').html(drawingtext);
        b_chat.write_comment(drawingtext);
    }

    // 終了時間を記述
    this.setFinalTime = function(drawtime,date,leng){
        var msec =  Date.parse(date);
        // b_game._game_start_Date = new Date(msec);
        // var Jikan = b_game._game_start_Date;
        var Jikan = new Date(msec);
        var Hour = Jikan.getHours();
        var Minute = Jikan.getMinutes();
        var Second = Jikan.getSeconds();
        var gametime = leng*drawtime;
        Second = Second + gametime;
        var plusMin = 0;
        var plusH = 0;
        while(Second >= 60){
            Second = Second - 60;
            plusMin = plusMin + 1;
        }
        Minute = Minute + plusMin;
        while(Minute >= 60){
            Minute = Minute - 60;
            plusH = plusH + 1;
        }
        Hour = Hour + plusH;
        Minute += 1;
        this.change_finish_time(Hour,Minute);
    }

    // 描き始める時間設定
    this.setDrawStartTime = function(orderlist,drawing_user){
        for(var i=orderlist.length-1; i >= 0; i--){
            console.log("drawuser:",drawing_user);
            console.log("user",i,":",orderlist[i]);
            if(orderlist[i] == drawing_user){ // 描いてる人
                b_user._drawtime_list[i] = "now";
                console.log(b_user._drawtime_list[i]);
                break;
            }else{ // 描き終わった人
                b_user._drawtime_list[i] = "fin";
                console.log(b_user._drawtime_list[i]);
            }
        }
        for(var j=i-1; j >= 0; j--){ // これから描く人の描き始める時間を設定
            b_user._drawtime_list[j] = this.change_drawStart_time(b_game._draw_start_Date,i-j,b_game._drawtime);
            console.log(b_user._drawtime_list[j]);
        }
        b_user.updateDrawTime(orderlist,b_user._drawtime_list);
    }

    // これから描く人の描き始める時間の文字列を返す
    this.change_drawStart_time = function(date,num,drawtime){
        var msec =  Date.parse(date);
        // b_game._draw_start_Date = new Date(msec);
        // var Jikan = b_game._draw_start_Date;
        var Jikan = new Date(msec);
        var Minute = Jikan.getMinutes();
        var Second = Jikan.getSeconds();
        Second = Second + num * drawtime;
        var plusMin = 0;
        while(Second >= 60){
            Second = Second - 60;
            plusMin = plusMin + 1;
        }
        Minute = Minute + plusMin;
        while(Minute >= 60){
            Minute = Minute - 60;
        }
        if(Minute < 10){
            Minute = "0" + Minute;
        }
        if(Second < 10){
            Second = "0" + Second;
        }
        return Minute + ":" + Second;
    }

    // プログレスバーを動かす
    // 描き終わった時の処理もここ
    this.timelimit = function(drawtime){
        var downper =  100/drawtime;
        var run = function(time) {
            return $.Deferred(function(dfd) {
                setTimeout(dfd.resolve, time)
            }).promise();
        }
        run(300).then(function() {
            $('.progress .bar').each(function() {
                var $this = $(this)
                , rate = $this.attr('data-rate')
                , current = 100
                , currentsec = drawtime;
                var progress = setInterval(function() {
                    if(current <= rate) {
                        $this.css('width','0%');
                        clearInterval(progress);
                        b_paint._isDrawable = false;
                        b_paint._save_or_send_image(LAYER_N,2);
                    } else {
                        current -= downper;
                        currentsec -= 1;
                        $this.css('width', (current)+ '%');
                    }
                    var sec = currentsec
                    , min = 0;
                    while(sec > 60){
                        sec -= 60;
                        min += 1;
                    }
                    $this.text((min)+'分'+(sec)+ '秒');
                }, 1000);
            });
        });
    }

    // canvasに絵を映す
    this.draw_img_core = function(show_img){
        var img = new Image();
        var context = b_paint._canvas1.getContext("2d");
        var d = show_img.replace('image/png', 'image/octet-stream');
        img.src = d;
        img.onload = function() {
            context.globalAlpha = 1.0; // 返ってきた絵が薄くなることを防ぐ
            context.drawImage(img, 0, 0);
            b_paint._get_undo_img();
        }
    }

    // 前の人の絵をcanvasに映す
    this.draw_beforeuser_img = function(before_img,draw_user){
        if(draw_user == b_user._user){
            this.draw_img_core(before_img);
        }
    }

    // 描いてる人の名前の色を変化させる
    this.change_drawinguser_color = function(draw_user){
        for(var j = 0; j < b_user._users.length; j++){
            if($('#userNum'+j).html() == draw_user){
                $('#userNum'+j).css("color","#B94A48");
            }else{
                $('#userNum'+j).css("color","#3a87ad");
            }
        }
    }

    // キャンバスを画像化
    this.to_img = function(){
        $('#image_png').empty();
        for(var i=0; i < b_game._img_list._imgs.length; i++){
            var insertimg="<li class='span3' id='imgli'><a href='javascript:void(0)' class='thumbnail'><img id='imgs' border='2px solid #ccc' src='"+b_game._img_list._imgs[i]+"' name='"+b_game._img_list._users[i]+"'><h5>"+b_game._img_list._users[i]+"さんの作品</h5></li></a>";
            $('#image_png').append(insertimg);
        }
    }

    // クリックしたユーザを返す
    this.return_click_userlist_num = function(clickuser){
        console.log(b_user._order_list);
        for(var i=0; i < b_user._order_list.length; i++){
            if(clickuser == b_user._order_list[i]){
                var num = i;
            }
        }
        return num;
    }

    // ほすとの処理
    // げーむすたーとできるか
    this.can_start_game = function(list_length){
        if(list_length == 0){
            $('#start').removeClass('disabled');
            b_game._isStart = true;
        }else{
            b_game._isStart = false;
            $('#start').addClass('disabled');
        }
    }

    // ホスト更新
    this.renewal_host = function(hostname){
        console.log("host:",hostname,",user:",b_user._user);
        if(hostname == b_user._user){
            this._isHost = true;
            if(this._mode.wait){
                $('#host').css({"visibility":"visible"});
            }else if(this._mode.finish){
                $('#newgame').css({"visibility":"visible"});
            }
        }else{
            this._isHost = false;
        }
    }


}