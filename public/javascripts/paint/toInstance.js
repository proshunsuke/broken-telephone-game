var b_user = new User();
var b_sync = new Sync();
var b_paint = new Paint();
var b_tool = new Tool();
var b_layer = new Layer();
var b_chat = new Chat();
var b_game = new Game();
var b_room = new Room();
var b_oekaki_list = new Oekaki_list();

function toInstance_init(){

    //イベント
    mouse_event_init();
    keypress_event_init();
    slide_event_init();

    //インスタンス初期化
    b_sync.init();
    b_user.init();
    b_paint.init();
    b_tool.init();
    b_chat.init();
    b_game.init();
}

//マウスイベント
function mouse_event_init(){

    // キャンバス

    // スポイト
    $('canvas').click(function(e) {
        if(b_paint._isDrawable){
            if(b_tool._tools.spuit){
                b_paint._mouse_click(e,$(this).offset().left,$(this).offset().top);
            }
        }
    });

    // マウスダウン
    $('canvas').mousedown(function(e) {
        if(b_paint._isDrawable){
            if(!b_tool._tools.spuit){
                b_paint._mouse_down(e,$(this).offset().left,$(this).offset().top);
            }
        }
    });

    // マウスを動かした時
    $('canvas').mousemove(function(e) {
        if(b_paint._isDrawable){
            if(b_paint._draw_flag){
                b_paint._mouse_move(e,$(this).offset().left,$(this).offset().top);
            }
        }
    });

    // マウスを離した時
    $('canvas').on('mouseup', function() {
        b_paint._mouse_up();
    });

    // マウスがキャンバスからはみ出た時
    $('canvas').on('mouseleave', function() {
        b_paint._mouse_leave();
    });


    //ツール クリックしたツールをtrueに
    $("[name='tool']").click(function(){
        var tool_name = $(this).attr("id");
        b_tool.change_tool(tool_name);
    });



    // color
    $('#colorArea td').click(function() {
        clic_color = new RGBColor($(this).css('background-color'));
        $('#colorArea td').removeClass('clic');
        $(this).addClass('clic');
        $("#newcolor").css("background-color",clic_color.toHex());
    });

    // レイヤー
    $('#layerArea li').live('click',function(){
        var clickli = $(this);
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
            b_paint._undo_context[i].putImageData(b_paint._undoImage[i],0,0);
        }
    });

    // 復元
    $('#restore').click(function(e) {
        for(var i=0; i < LAYER_N; i++){
            b_paint._undo_context[i].putImageData(b_paint._restoreImage[i],0,0);
        }
    });

    // 消去
    $('#clear').click(function(e) {
        e.preventDefault();
        b_paint.clear_canvas();
    });

    // 画像で保存
    $('#save').click(function() {
        var canvas = b_paint._canvasSave;
        var context = canvas.getContext("2d");
        var canvas_array = [b_paint._canvas1,b_paint._canvas2,b_paint._canvas3];
        b_paint._save_or_send_image(LAYER_N,1);
    });

    // 描き始める
    $('#startdraw').live("click",function(){
        b_paint.clear_canvas();
        b_paint._isDrawable = true;
        $('#startdraw').css({"visibility":"hidden"});
    });

    // ゲーム開始
    $('#start').live("click",function(){
        if(b_game._isStart){
            var gettime = $("input[name='drawtime']:checked").attr("id");
            b_sync.emit_order(b_user._order_list,gettime);
            $('#start').addClass('disabled');
            b_game._isStart = false;

            $("#canvases").css({"display":"block"});
            $("#start").css({"visibility":"hidden"});
            $("#hostSettingArea").css({"display":"none"});
            $("#canvasTool").css({"visibility":"visible"});


        }
    });

    // キャンバスを画像化
    $('#toimg').live("click",function(){
        b_game.to_img();
        $('#toimg').css({"visibility":"hidden"});
    });

    // NEWGAME
    $('#newgame').live("click",function(){
        $('#newgame').css({"visibility":"hidden"});
        b_sync.emit_newgame();
    });


    // ユーザ名をクリックした時
    $('#usernameArea div').live("click",function(){
        if(b_game._mode.finish){
            var click_user = $(this).html();
            // var num = b_game.return_click_userlist_num(click_user);
            b_paint.clear_canvas();
            b_game.draw_img_core(b_game._img_list.recent_user_img(click_user));
            b_game.change_drawinguser_color(click_user);
        }
    });

    // 下の絵をくりっくした時
    $('#imgli img').live('click',function(){
        if(!b_game._mode.gaming){
            var url = $(this).attr("src");
            var name = $(this).attr("name");
            b_paint.clear_canvas();
            b_game.draw_img_core(url);
            b_game.change_drawinguser_color(name);
        }
    });




    // ホストとか

    // ホストになる
    $('#host').live("click",function(){
        b_game._isHost = true;
        b_sync.emit_host(true,b_user._user);

        $("#canvases").css({"display":"none"});
        $("#start").css({"visibility":"visible"});
        $("#hostSettingArea").css({"display":"block"});
        $("#canvasTool").css({"visibility":"hidden"});

        b_user._user_list = b_user._users.concat();
        b_user.updateUserList(b_user._user_list,"drawuserNum","canvasusernameArea");
    });

    // ホストで、ログイン中のユーザをクリックしたら、描く順番へ入れる
    $('#canvasusernameArea div').live("click",function(){
        var clickuser;
        // クリックしたらそのユーザを消す
        for(var i = 0; i < b_user._user_list.length; i++){
            if(b_user._user_list[i] == $(this).html()){
                clickuser = b_user._user_list[i];
                b_user._user_list.splice(i,1);
            }
        }

        b_user._order_list.unshift($(this).html());
        b_user.updateUserList(b_user._order_list,"orderuserNum","canvasordernameArea");
        b_user.updateUserList(b_user._user_list,"drawuserNum","canvasusernameArea");

        // if(b_user._user_list.length == 0　&& $('#start').hasClass('disabled')){
        //     $('#start').removeClass('disabled');
        //     b_game._isStart = true;
        // }

        b_game.can_start_game(b_user._user_list.length);
    });

    // ホストで、描く順番をクリックしたら、ログイン中のユーザへ入れる
    $('#canvasordernameArea div').live("click",function(){
        var clickuser;
        // クリックしたらそのユーザを消す
        for(var i = 0; i < b_user._order_list.length; i++){
            if(b_user._order_list[i] == $(this).html()){
                clickuser = b_user._order_list[i];
                b_user._order_list.splice(i,1);
            }
        }

        b_user._user_list.unshift($(this).html());
        b_user.updateUserList(b_user._order_list,"orderuserNum","canvasordernameArea");
        b_user.updateUserList(b_user._user_list,"drawuserNum","canvasusernameArea");

        b_game.can_start_game(b_user._user_list.length);
    });
}

// キーイベント
function keypress_event_init(){

    $('#commentarea').live('keypress',function (e) {
        if(e.keyCode == 13) {
            box = $(this);
            var t_val = $(box).val();

            if(t_val.length > 0) {
                b_sync.emit_comment(t_val,b_user._user);
                $(box).val("");
            }
            e.preventDefault();
        }
    });

}

//スライドイベント
function slide_event_init(){

    $("#slider").slider({
        min: 1,
        max: 100, // ブラシの最大サイズ
        value : 10,  // 最初のブラシサイズ
        slide : function(evt, ui){
            b_paint._brushSize = ui.value; // ブラシサイズを設定
            $("#bw").val(b_paint._brushSize);
        }
    });
    $('#bw').val($('#slider').slider('value'));

    $('#slider2').slider({
        min: 1,
        max: 100,
        value : 100,  // 初期値（不透明）
        slide : function(evt, ui){
            alpha = ui.value;
            $('#alpha').val(alpha);
            if(alpha == 100){
                b_paint._alphaSize = 1;
            }else if(alpha <= 9){
                b_paint._alphaSize = '0.0' + alpha;
            }else if(alpha >= 10){
                b_paint._alphaSize = '0.' + alpha;
            };
        }
    });
    $('#alpha').val($('#slider2').slider('value'));

}
