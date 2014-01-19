{ //マウスイベント

    var mouseEvent = {

        init: function(){

            // キャンバス

            // スポイト
            $('canvas').click(function(e) {
                if(paint.getMisDrawable()){
                    if(tool.mTools.spuit){
                        paint.mouseClick(e,$(this).offset().left,$(this).offset().top);
                    }
                }
            });

            // マウスダウン
            $('canvas').mousedown(function(e) {
                if(paint.getMisDrawable()){
                    if(!tool.mTools.spuit){
                        paint.mouseDown(e,$(this).offset().left,$(this).offset().top);
                    }
                }
            });

            // マウスを動かした時
            $('canvas').mousemove(function(e) {
                if(paint.getMisDrawable()){
                    if(paint.getMdrawFlag()){
                        paint.mouseMove(e,$(this).offset().left,$(this).offset().top);
                    }
                }
            });

            // マウスを離した時
            $('canvas').on('mouseup', function() {
                paint.mouseUp();
            });

            // マウスがキャンバスからはみ出た時
            $('canvas').on('mouseleave', function() {
                paint.mouseLeave();
            });


            //ツール クリックしたツールをtrueに
            $("[name='tool']").click(function(){
                let mToolName = $(this).attr("id");
                tool.changeTool(mToolName);
            });

            // color
            $('#colorArea td').click(function() {
                let mClickColor = new RGBColor($(this).css('background-color'));
                $('#colorArea td').removeClass('clic');
                $(this).addClass('clic');
                $("#newcolor").css("background-color",mClickColor.toHex());
            });

            // レイヤー
            $('#layerArea li').live('click',function(){
                let clickli = $(this);
                $('#layerul li:nth-child(n)').each(function(){
                    if($(this).attr("id") == clickli.attr("id")){
                        $(this).addClass('active');
                    }else{
                        $(this).removeClass('active');
                    }
                });
            });

            // キャンバスボタン
            // 戻る
            $('#undo').click(function(e) {
                for(var i=0; i < LAYER_N; i++){
                    paint.mUndoContext[i].putImageData(paint._undoImage[i],0,0);
                }
            });

            // 復元
            $('#restore').click(function(e) {
                for(var i=0; i < LAYER_N; i++){
                    paint.mUndoContext[i].putImageData(paint.mRestoreImg[i],0,0);
                }
            });

            // 消去
            $('#clear').click(function(e) {
                e.preventDefault();
                paint.clearCanvas();
            });

            // 画像で保存
            $('#save').click(function() {
                var canvas = paint.mCanvasSave;
                var context = canvas.getContext("2d");
                var canvas_array = [paint.mCanvas1,paint.mCanvas2,paint.mCanvas3];
                paint.saveOrSendImg(LAYER_N,1);
            });

            // 描き始める
            $('#startdraw').live("click",function(){
                paint.clearCanvas();
                paint.setMisDrawable(true);
                $('#startdraw').css({"visibility":"hidden"});
            });

            // ゲーム開始
            $('#start').live("click",function(){
                let isStart = game.getMisStart();
                if(isStart){
                    var gettime = $("input[name='drawtime']:checked").attr("id");
                    sync.emitOrder(user.getMorderList(),gettime);
                    $('#start').addClass('disabled');
                    isStart = false;
                    game.setMisStart(isStart);
                    $("#canvases").css({"display":"block"});
                    $("#start").css({"visibility":"hidden"});
                    $("#hostSettingArea").css({"display":"none"});
                    $("#canvasTool").css({"visibility":"visible"});


                }
            });

            // キャンバスを画像化
            $('#toimg').live("click",function(){
                game.toImg();
                $('#toimg').css({"visibility":"hidden"});
            });

            // NEWGAME
            $('#newgame').live("click",function(){
                $('#newgame').css({"visibility":"hidden"});
                sync.emitNewGame();
            });


            // ユーザ名をクリックした時
            $('#usernameArea div').live("click",function(){
                if(game.mode.finish){
                    let mClickUser = $(this).html();
                    let imgList = game.getMimgList();
                    paint.clearCanvas();
                    game.drawImgCore(imgList.recentUserImg(mClickUser));
                    game.changeDrawingUserColor(mClickUser);
                }
            });

            // 下の絵をくりっくした時
            $('#imgli img').live('click',function(){
                if(!game.mode.gaming){
                    let url = $(this).attr("src");
                    let name = $(this).attr("name");
                    paint.clearCanvas();
                    game.drawImgCore(url);
                    game.changeDrawingUserColor(name);
                }
            });


            // ホストとか

            // ホストになる
            $('#host').live("click",function(){
                game.setMisHost(true);
                sync.emitHost(true,user.getMuser());

                $("#canvases").css({"display":"none"});
                $("#start").css({"visibility":"visible"});
                $("#hostSettingArea").css({"display":"block"});
                $("#canvasTool").css({"visibility":"hidden"});

                user.setMuserList(user.getMusers().concat());
                user.updateUserList(user.getMuserList(),"drawuserNum","canvasusernameArea");
            });

            // ホストで、ログイン中のユーザをクリックしたら、描く順番へ入れる
            $('#canvasusernameArea div').live("click",function(){
                let clickuser;
                let userList = user.getMuserList().concat();
                let orderList = user.getMorderList().concat();

                // クリックしたらそのユーザを消す
                for(var i = 0; i < userList.length; i++){
                    if(userList[i] == $(this).html()){
                        clickuser = userList[i];
                        userList.splice(i,1);
                        user.setMuserList(userList);
                    }
                }

                orderList.unshift($(this).html());
                user.setMorderList(orderList);
                user.updateUserList(orderList,"orderuserNum","canvasordernameArea");
                user.updateUserList(userList,"drawuserNum","canvasusernameArea");

                game.canStartGame(userList.length);
            });

            // ホストで、描く順番をクリックしたら、ログイン中のユーザへ入れる
            $('#canvasordernameArea div').live("click",function(){
                let clickuser;
                let orderList = user.getMorderList().concat();
                let userList = user.getMuserList().concat();

                // クリックしたらそのユーザを消す
                for(var i = 0; i < orderList.length; i++){
                    if(orderList[i] == $(this).html()){
                        clickuser = orderList[i];
                        orderList.splice(i,1);
                        user.setMorderList(orderList);
                    }
                }

                userList.unshift($(this).html());
                user.setMuserList(userList);
                user.updateUserList(orderList,"orderuserNum","canvasordernameArea");
                user.updateUserList(userList,"drawuserNum","canvasusernameArea");

                game.canStartGame(userList.length);
            });
        }
    };
}