{ //マウスイベント

    var mouseEvent = {

        init: function(){

            // キャンバス

            // スポイト
            $('canvas').click(function(e) {
                if(paint.getMisDrawable()){
                    if(tool.getMtools()["spuit"]){
                        paint.mouseClick(e,$(this).offset().left,$(this).offset().top);
                    }
                }
            });

            // マウスダウン
            $('canvas').mousedown(function(e) {
                if(paint.getMisDrawable()){
                    if(!tool.getMtools()["spuit"]){
                        paint.mouseDown(e,$(this).offset().left,$(this).offset().top);
                    }
                }
            });

            // マウスを動かした時
            $('canvas').mousemove(function(e) {
                if(paint.getMisDrawable()){
                    if(paint.getMdrawFlag() && !tool.getMtools()["fillDraw"]){
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
            $('#toolBox td').click(function(){
                $('#toolBox td').removeClass('clict');
                $('#toolBox td').addClass('ofclict');
                $(this).removeClass('ofclict');
                $(this).addClass('clict');
                tool.changeTool($(this).attr("value"));
            });


            // color
            $('#colorArea td').click(function() {
                let mClickColor = new RGBColor($(this).css('background-color'));
                $('#colorArea td').removeClass('clic');
                $(this).addClass('clic');
                paint.setColor(mClickColor.toHex());
            });

            // brush
            $('#blushBox td').click(function(){
                $('#blushBox td').removeClass('clicb');
                $(this).removeClass('ofclicb');
                $(this).addClass('clicb');
                paint.setMbrushSize($(this).attr("value"));
            });

            // 透明度
            $('#alphaBox td').click(function(){
                $('#alphaBox td').removeClass('clica');
                $(this).removeClass('ofclica');
                $(this).addClass('clica');
                paint.setMalphaSize($(this).attr("value"));
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
                if(!$("#undo").hasClass("disabled")){
                    for(var i=0; i < LAYER_N; i++){
                        layer.putImageDataToUndoContext(layer.getMundoImg(),layer.getMcanUndoNum(),i);
                    }
                    layer.canUndoNumMinus();
                }
            });

            // 復元
            $('#restore').click(function(e) {
                if(!$('#restore').hasClass("disabled")){
                    layer.canUndoNumPlus();
                    for(var i=0; i < LAYER_N; i++){
                        if(layer.getMundoImg().length <= layer.getMcanRestoreNum()){
                            layer.putImageDataToRestoreContext(layer.getMrestoreImg(),i);
                        }else{
                            layer.putImageDataToUndoContext(layer.getMundoImg(),layer.getMcanRestoreNum(),i);
                        }
                    }
                }
            });

            // 消去
            $('#clear').click(function(e) {
                if(!$('#clear').hasClass("disabled")){
                    e.preventDefault();
                    layer.clearCanvas();
                    $('#clear').addClass("disabled");
                    layer.canUndoNumMinus();
                }
            });

            // 画像で保存
            $('#save').click(function() {
                layer.saveOrSendImg(LAYER_N,1);
            });

            // 描き始める
            $('#startdraw').live("click",function(){
                layer.clearCanvas();
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
                    $("#hostSettingArea").css({"display":"none"});
                    $("#canvasbox").css({"display":"block"});
                }
            });

            // キャンバスを画像化
            $('#toimg').live("click",function(){
                game.toImg();
                $('#toimg').css({"visibility":"hidden"});
                chat.writeComment("この絵のタイトルは「"+game.getMtitle()+"」です");
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
                    layer.clearCanvas();
                    game.drawImgCore(imgList.recentUserImg(mClickUser));
                    game.changeDrawingUserColor(mClickUser);
                }
            });

            // 下の絵をくりっくした時
            $('#imgli img').live('click',function(){
                if(!game.mode.gaming){
                    let url = $(this).attr("src");
                    let name = $(this).attr("name");
                    layer.clearCanvas();
                    game.drawImgCore(url);
                    game.changeDrawingUserColor(name);
                }
            });


            // ホストとか

            // ホストになる
            $('#host').live("click",function(){
                game.setMisHost(true);
                sync.emitHost(true,user.getMuser());

                $("#canvasbox").css({"display":"none"});
                $("#hostSettingArea").css({"display":"block"});

                user.setMuserList(user.getMusers());
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