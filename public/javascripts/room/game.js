{

    let mIsHost;
    let mIsStart;
    let mDrawTime;
    let mDrawStartDate; // 現在描いている人の描きはじめた時刻
    //_game_start_Date; // ゲームが始まった時刻
    let mImgList;
    let mTitle;

    // この4つは特別 ゲームのモード
    let wait;
    let setting;
    let gaming;
    let finish;

    // プログレスバーを動かす
    // 描き終わった時の処理もここ
    let timelimit = function(drawtime){
        let downper =  100/drawtime;
        let run = function(time) {
            return $.Deferred(function(dfd) {
                setTimeout(dfd.resolve, time)
            }).promise();
        }
        run(300).then(function() {
            $('.progress .bar').each(function() {
                let $this = $(this)
                    , rate = $this.attr('data-rate') // ここでエラー $attr is not defined
                    , current = 100
                    , currentsec = drawtime;
                let progress = setInterval(function() {
                    if(current <= rate) {
                        $this.css('width','0%');
                        clearInterval(progress);
                        paint.setMisDrawable(false);
                        layer.saveOrSendImg(LAYER_N,2);
                    } else {
                        current -= downper;
                        currentsec -= 1;
                        $this.css('width', (current)+ '%');
                    }
                    let sec = currentsec
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

    // 自分が描く番だったときの処理
    let startDrawing = function(drawUser, orderList){
        audios.play();
        if(orderList[orderList.length-1] == drawUser){ // 一番最初の人は書き始めるボタン押さなくても良い
            layer.clearCanvas();
            paint.setMisDrawable(true);
            $('#startdraw').css({"visibility":"hidden"});
        }else{
            $('#startdraw').css({"visibility":"visible"});
        }
        $('.progress .bar').css('width:100%');
        timelimit(mDrawTime);
    }

    var game = {

        //getter

        getMisHost: function(){
            return mIsHost;
        },

        getMisStart: function(){
            return mIsStart;
        },

        getMdrawTime: function(){
            return mDrawTime;
        },

        getMdrawStartDate: function(){
            return mDrawStartDate;
        },

        getMimgList: function(){
            return mImgList;
        },

        getMtitle: function(){
            return mTitle;
        },

        getMimgListMusers: function(){
            return mImgList.mUsers;
        },

        getMimgListImg: function(){
            return mImgList.mImgs;
        },

        //setter

        setMisHost: function(isHost){
            mIsHost = isHost;
        },

        setMisStart: function(isStart){
            mIsStart = isStart;
        },

        setMdrawTime: function(drawTime){
            mDrawTime = drawTime;
        },

        setMdrawStartDate: function(drawStartDate){
            mDrawStartDate = drawStartDate;
        },

        setMimgList: function(imgList){
            mImgList = imgList.concat();
        },

        setMtitle: function(title){
            mTitle = title;
        },

        setMimgListMusers: function(imgListUsers){
            mImgList.mUsers = imgListUsers.concat();
        },

        setMimgListMimgs: function(imgListImgs){
            mImgList.mImgs = imgListImgs.concat();
        },

        init: function(){
            mIsHost = false;
            mIsStart = false;
            mDrawTime = 120;
            mDrawStartDate = new Date();
            mImgList = new ImgListClass();

            mode.wait = true;
            mode.setting = false;
            mode.gaming = false;
            mode.finish = false;
        },

        mode: function(){
            wait;
            setting;
            gaming;
            finish;
        },

        changeMode: function(mode,username){
            for(var i in this.mode){
                this.mode[i] = false;
            }
            this.mode[mode] = true;

            let modetext;
            if(this.mode.wait){
                modetext = "待機中";
            }else if(this.mode.setting){
                modetext = username + "さんが設定中です";
            }else if(this.mode.gaming){
                modetext = "ゲーム中";
            }else if(this.mode.finish){
                modetext = "ゲーム終了";
            }
            $('#mode').html(modetext);
            chat.writeComment(modetext);

        },

        changeFinishTime: function(Hour,Minute,Second){
            let finishTimeText;
            if(this.mode.wait){
                finishTimeText = "終了予定：";
            }else{
                finishTimeText = "終了予定：" + Hour + "時" + Minute + "分" + Second + "秒";
            }
            $('#finishtime').html(finishTimeText);
        },

        changeUserListLabel: function(){
            if(this.mode.gaming || this.mode.finish){
                $('#userslist').html('描く順番');
            }else if(this.mode.wait || this.mode.setting){
                $('#userslist').html('ログイン中のユーザ');
            }
        },

        // 描くもののタイトルを決める
        setGameTitle: function(){
            $('#setTitleModal').modal("show");
        },

        // ゲームの情報をセットする
        setDrawingInfo: function(drawUser){
            let drawingtext;
            if(drawUser == "none"){
                drawingtext = '誰も描いていません';
            }else if(drawUser == user.getMuser()){ // 自分が描く番
                drawingtext = 'あなたの番です';
                startDrawing(drawUser, user.getMorderList());
            }else{
                drawingtext = drawUser + ' さんが描いています';
            }
            $('#drawing').html(drawingtext);
            chat.writeComment(drawingtext);
        },


        // 終了時間を記述
        setFinalTime: function(drawtime,date,leng){
            let msec =  Date.parse(date);
            let Jikan = new Date(msec);
            let Hour = Jikan.getHours();
            let Minute = Jikan.getMinutes();
            let Second = Jikan.getSeconds();
            let gametime = leng*drawtime;
            Second = Second + gametime;
            let plusMin = 0;
            let plusH = 0;
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
            this.changeFinishTime(Hour,Minute,Second);
        },

        // 描き始める時間設定
        setDrawStartTime: function(orderlist,drawingmUser){
            let drawTimeList = user.getMdrawTimeList().concat();
            for(var i=orderlist.length-1; i >= 0; i--){
                if(orderlist[i] == drawingmUser){ // 描いてる人
                    drawTimeList[i] = "now";
                    break;
                }else{ // 描き終わった人
                    drawTimeList[i] = "fin";
                };
                user.setMdrawTimeList(drawTimeList);
            }
            for(var j=i-1; j >= 0; j--){ // これから描く人の描き始める時間を設定
                drawTimeList[j] = this.changeDrawStartTime(mDrawStartDate,i-j,this.getMdrawTime());
                user.setMdrawTimeList(drawTimeList);
            }
            user.updateDrawTime(orderlist,drawTimeList);
        },

        // これから描く人の描き始める時間の文字列を返す
        changeDrawStartTime: function(date,num,drawtime){
            let msec =  Date.parse(date);
            let Jikan = new Date(msec);
            let Minute = Jikan.getMinutes();
            let Second = Jikan.getSeconds();
            Second = Second + num * drawtime;
            let plusMin = 0;
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
        },

        // canvasに絵を映す
        drawImgCore: function(show_img){
            let img = new Image();
            let context = layer.getMcanvas1().getContext("2d");
            let d = show_img.replace('image/png', 'image/octet-stream');
            img.src = d;
            img.onload = function() {
                context.globalAlpha = 1.0; // 返ってきた絵が薄くなることを防ぐ
                context.drawImage(img, 0, 0);
                layer.getUndoImg();
            }
        },

        // 前の人の絵をcanvasに映す
        drawBeforeUserImg: function(beforeImgList,drawmUser){
            if(drawmUser == user.getMuser()){
                this.drawImgCore(beforeImgList.img);
            }
        },

        // 描いてる人の名前の色を変化させる
        changeDrawingUserColor: function(drawmUser){
            for(var j = 0; j < user.getMusers().length; j++){
                if($('#userNum'+j).html() == drawmUser){
                    $('#userNum'+j).css("color","#B94A48");
                }else{
                    $('#userNum'+j).css("color","#3a87ad");
                }
            }
        },

        // キャンバスを画像化
        toImg: function(){
            $('#image_png').empty();
            for(var i=0; i < mImgList.length; i++){
                let insertimg="<li class='span3' id='imgli'><a href='javascript:void(0)' class='thumbnail'><img id='imgs' border='2px solid #ccc' src='"+mImgList[i].img+"' name='"+mImgList[i].user+"'><h5>"+mImgList[i].user+"さんの作品</h5></li></a>";
                $('#image_png').append(insertimg);
            }
        },

        // クリックしたユーザを返す
        returnClickUserListNum: function(clickuser){
            let orderList = user.getMuserList().concat();
            let num;
            for(var i=0; i < orderList.length; i++){
                if(clickuser == orderList[i]){
                    num = i;
                }
            }
            return num;
        },

        // ホストの処理
        // ゲームスタートできるか
        canStartGame: function(list_length){
            if(list_length == 0){
                $('#start').removeClass('disabled');
                mIsStart = true;
            }else{
                mIsStart = false;
                $('#start').addClass('disabled');
            }
        },

        // ホスト更新
        renewalHost: function(hostname){
            if(hostname == user.getMuser()){
                mIsHost = true;
                if(this.mode.wait){
                    $('#host').css({"visibility":"visible"});
                }else if(this.mode.finish){
                    $('#newgame').css({"visibility":"visible"});
                }
            }else{
                mIsHost = false;
            }
        }
    };
}