window.onload = function(){
    var user;
    var users =[];
    var imglist = [];
    var commentlist = [];
    var context;
    var canvastype = 1;

    var drawtime;
    var isClickHost = false;
    var isDrawable = true;
    var isGameFin = false;
    var isStart = false;

    var offset = 5;
    var startX;
    var startY;
    var brushSize = 10;
    var alphaSize = 1;
    var brushColor = '#000000';
    var flag = false;

    var canvas1 = $('canvas').get(0);
    var canvas2 = $('canvas').get(1);
    var canvas3 = $('canvas').get(2);

    var Tools = function(brush1,brush2,brush3,brush4,brushm,eraser){
        this.brush1 = brush1;
        this.brush2 = brush2;
        this.brush3 = brush3;
        this.brush4 = brush4;
        this.brushm = brushm;
        this.eraser = eraser;
    }



    var insertpagename = "<li class='active' id='paint'><a href='/paint'>Paint</a></li>";
    $('#nav-ul').append(insertpagename);

    socket = io.connect('http://'+location.host+'/', {'sync disconnect on unload' : true});
    user = document.getElementById('yourname').getAttribute('value');

    socket.on('connect', function(data) {
        socket.emit('login',{
            user: user,
        });
    });

    socket.on('updateLoginUsers', function(users){
        console.log('updataLoginUsers# users=' + users);
        updateLoginUsers(users);
    });

    socket.on('login',function(data){
        console.log("data:",data);
        // 入ってきたらユーザ配列に追加
        users = data.users.concat();
        orderlist = data.orderlist.concat();
        updateLoginUsers(users);

        //入ってきた人だけ
        switch(data.mode){
        case 0://準備中、または全員に関する処理
            break;
        case 1://設定中
            document.getElementById("host").style.visibility="hidden";
            var modetext = data.hostname + "さんが設定中です";
            $('#mode').html(modetext);
            break;
        case 2://オーダできたら、://誰かが描いてる途中だったら
            isDrawable = false;
            $('#mode').html("ゲーム中");
            $('#userslist').html('描く順番');
            document.getElementById("host").style.visibility="hidden";
            var drawingtext = data.nextuser + ' さんが描いています';
            $('#drawing').html(drawingtext);
            drawtime = data.drawtime;
            break;
        case 3://ゲームが終わったら
            isGameFin = true;
            $('#mode').html("ゲーム終了");
            $('#drawing').html("誰も描いていません");
            document.getElementById("host").style.visibility="hidden";
            break;
        case 4://newgameになったら
            break;
        }

        if($('#mode').html() == "ゲーム中"){
            setFinalTime(drawtime);
        }


        if (isClickHost){
            //ホストのログインユーザを更新
            userlist.unshift(data.users[0]);
            updateUserList(userlist,"drawuserNum","canvasusernameArea");
        }


        var addcomment = users[0] + "さんがログインしました。";
        commentlist.push(addcomment);
        renewalComment(commentlist);

    });


    socket.on('disconnect',function(data){
        for(var i = 0; i < users.length; i++){
            if(users[i] == data.user){
                users.splice(i,1);
                if (isClickHost){
                    //ホストのログインユーザを更新
                    userlist.splice(i,1);
                    updateUserList(userlist,"drawuserNum","canvasusernameArea");
                }
            }
        }
        updateLoginUsers(users);

        var addcomment = data.user + "さんがログアウトしました。";
        commentlist.push(addcomment);
        renewalComment(commentlist);

    });

    socket.on('logout',function(data){
        console.log(data);
    });

    socket.on('disconnect',function(){
        console.log(socket.sessionID + "が切断しました");
    });

    socket.on('order',function(data){
        //全員に共通の処理
        $('#userslist').html('描く順番');
        $('#mode').html('ゲーム中');
        orderlist = data.list;
        updateLoginUsers(orderlist);
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
        isDrawable = false;
        drawtime = data.drawtime;
        setFinalTime(drawtime);

        //ホストのcanvasを復活
        if(isClickHost){
            $('#canvasbox #orderInHost').remove();
            $('#canvasbox #userInHost').remove();
            $('#canvasbox #timeInHost').remove();

            document.getElementById("canvasArea1").style.display="block";
            document.getElementById("start").style.visibility="hidden";
            document.getElementById("undo").style.visibility="visible";
            document.getElementById("restore").style.visibility="visible";
            document.getElementById("clear").style.visibility="visible";
            document.getElementById("save").style.visibility="visible";
        }

        //一番目の人
        var i = orderlist.length - 1;
        if(orderlist[i] == user){
            var drawingtext = 'あなたの番です';
            document.getElementById("startdraw").style.visibility="visible";
            $('.progress .bar').css('width:100%');
            timelimit(drawtime);
        }else{
            var drawingtext = orderlist[i] + ' さんが描いています'
        }

        for(var j = 0; j < users.length ; j++){
            if($('#userNum'+j).html() == orderlist[i]){
                $('#userNum'+j).css("color","#B94A48");
            }
        }

        $('#drawing').html(drawingtext);
    });



    function timelimit(drawtime){
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
                        var img_png_src = canvas.toDataURL();
                        imglist.unshift(img_png_src);
                        socket.emit('drawfin',{
                            finuser: user,
                            list: orderlist,
                            imglist: imglist,
                        });
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

    function setFinalTime(drawtime){
        var Jikan= new Date();
        var Hour = Jikan.getHours();
        var Minute = Jikan.getMinutes();
        var Second = Jikan.getSeconds();
        var gametime = orderlist.length*drawtime;
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
        var finishtimetext = "終了予定：" + Hour + "時" + Minute + "分";
        $('#finishtime').html(finishtimetext);

    }

    socket.on('drawfin',function(data){
        imglist = data.beforeimg.concat();
        console.log(data.nextuser);
        if(data.nextuser == user){
            var drawingtext = 'あなたの番です';

            //canvasエリアに前の人の絵を表示
            var img = new Image();
            //var num = imglist.length - 1;
            var d = imglist[0].replace('image/png', 'image/octet-stream');
            img.src = d;
            img.onload = function() {
                context.drawImage(img, 0, 0);
            }

            document.getElementById("startdraw").style.visibility="visible";
            //timelimit(data.drawtime);
            $('.progress .bar').css('width:100%');
            console.log("drawtime:",drawtime);
            timelimit(drawtime);
        }else{
            isDrawable = false;
            var drawingtext = data.nextuser + ' さんが描いています'
        }

        for(var j = 0; j < users.length ; j++){
            if($('#userNum'+j).html() == data.nextuser){
                $('#userNum'+j).css("color","#B94A48");
            }else{
                $('#userNum'+j).css("color","#3a87ad");
            }
        }

        $('#drawing').html(drawingtext);

    });

    socket.on('gamefin',function(){
        console.log('ゲームが終了しました');
        $('#mode').html("ゲーム終了");
        $('#drawing').html("誰も描いていません");
        document.getElementById("toimg").style.visibility="visible";
        if(isClickHost){
            document.getElementById("newgame").style.visibility="visible";
        }
        isGameFin = true;
    });

    socket.on('host',function(data){
        document.getElementById("host").style.visibility="hidden";
        var modetext = data.hostname + "さんが設定中です";
        $('#mode').html(modetext);
    });

    function updateLoginUsers(users){
        for(var j = 0; j < users.length + 1; j++){
            $('#userNum'+j).remove();
        }
        for(var i in users){
            console.log("users[" + i + "]:",users[i]);
            var num = users.length - i -1;
            var insertdiv = "<div id ='userNum"+num+"'>"+users[i]+"</div>";
            $('#usernameArea').prepend(insertdiv);
        }
    }

    socket.on('newgame',function(data){
        isDrawable = true;
        isClickHost = false;
        isGameFin = false;
        $('#finishtime').html("終了予定；");
        $('#userslist').html('ログイン中のユーザ');
        $('#mode').html("待機中");
        document.getElementById("toimg").style.visibility="hidden";
        document.getElementById("host").style.visibility="visible";
        updateLoginUsers(users);
        orderlist = [];
        userlist = [];
        imglist = [];
    });

    socket.on('comment',function(data){
        var addcomment = data.user + "：" + data.comment;
        commentlist.push(addcomment);
        renewalComment(commentlist);

    });

    //ホストの決定ボタンと描き始めるボタンを非表示に
    document.getElementById("start").style.visibility="hidden";
    document.getElementById("startdraw").style.visibility="hidden";
    document.getElementById("newgame").style.visibility="hidden";
    document.getElementById("toimg").style.visibility="hidden";



        $("#slider").slider({
            min: 1,
            max: 100, // ブラシの最大サイズ
            value : 10,  // 最初のブラシサイズ
            slide : function(evt, ui){
                brushSize = ui.value; // ブラシサイズを設定
                $("#bw").val(brushSize);
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
                    alphaSize = 1;
                }else if(alpha <= 9){
                    alphaSize = '0.0' + alpha;
                }else if(alpha >= 10){
                    alphaSize = '0.' + alpha;
                }
            }
        });
        $('#alpha').val($('#slider2').slider('value'));

        $('#colorArea td').addClass('ofclic');
        $('#colorArea td').click(function() {
            clic_color = new RGBColor($(this).css('background-color'));
            // picker.setColor(clic_color.toHex());
            $('#colorArea td').removeClass('clic');
            $(this).addClass('clic');
            $("#newcolor").css("background-color",clic_color.toHex());
        });


    function draw_core(canvas,endX,endY,color,size,alpha,tool){
        if (canvas.getContext) {
            context = canvas.getContext('2d');
        }
        context.globalAlpha = alpha;
        context.beginPath();
        context.globalCompositeOperation = 'source-over';
        if(tool.eraser == true){
            context.strokeStyle = "#FFFFFF";
        }else{
            context.strokeStyle = color;
        }
        context.lineWidth = size;
        context.lineJoin= 'round';
        context.lineCap = 'round';
        context.shadowBlur = 0;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        context.closePath();
    }

    $('canvas').click(function(e) {
        if(isDrawable){
            var getspuit = $('#spuit').is(':checked');
            if(getspuit == true){
                spuitImage = context.getImageData(startX, startY, 1, 1);
                r = spuitImage.data[0];
                g = spuitImage.data[1];
                b = spuitImage.data[2];
                spuit_color = new RGBColor('rgb(' + r +','+ g + ',' + b +')');
                $("#newcolor").css("background-color",spuit_color.toHex());
            }
        }
    });


    $('canvas').mousedown(function(e) {
        if(isDrawable){
            console.log("mousedown");

            undoImage = context.getImageData(0, 0, $('canvas').width(), $('canvas').height());
            flag = true;
            startX = e.pageX - $(this).offset().left - offset;
            startY = e.pageY - $(this).offset().top - offset;
            return false; // for chrome
        }
    });

    //とりあえず
    var canvas = canvas1;
    if (canvas.getContext) {
        context = canvas.getContext('2d');
    }


    $('canvas').mousemove(function(e) {
        if(isDrawable){
            if (flag) {
                console.log("move");
                var endX = e.pageX - $('canvas').offset().left - offset;
                var endY = e.pageY - $('canvas').offset().top - offset;

                var brushColor = $("#newcolor").css("background-color");
                var getBrush1 = $('#brush1').is(':checked');
                var getBrush2 = $('#brush2').is(':checked');
                var getBrush3 = $('#brush3').is(':checked');
                var getBrush4 = $('#brush4').is(':checked');
                var getBrushm = $('#miter').is(':checked');
                var getEeraser = $('#eraser').is(':checked');

                var tool1 = new Tools(getBrush1,getBrush2,getBrush3,getBrush4,getBrushm,getEeraser);
                draw_core(canvas,endX,endY,brushColor,brushSize,alphaSize,tool1);

                startX = endX;
                startY = endY;
            }
        }
    });

    $('canvas').on('mouseup', function() {
        getImage = context.getImageData(0, 0, $('canvas').width(), $('canvas').height());
        flag = false;
    });

    $('canvas').on('mouseleave', function() {
        getImage = context.getImageData(0, 0, $('canvas').width(), $('canvas').height());
        flag = false;
    });

    $('#undo').click(function(e) {
        context.putImageData(undoImage,0,0);
    });

    $('#restore').click(function(e) {
        context.putImageData(getImage,0,0);
    });

    $('#clear').click(function(e) {
        e.preventDefault();
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
    });

    $('#save').click(function() {
        var d = canvas.toDataURL('image/png');
        d = d.replace('image/png', 'image/octet-stream');
        window.open(d, 'save');
    });

    // ここからホストの処理
    var userlist;
    var orderlist = [];

    $('#host').live("click",function(){

        isClickHost = true;

        socket.emit('host',{
            isClickHost: true,
            hostname: user,
        });

        document.getElementById("canvasArea1").style.display="none";
        document.getElementById("start").style.visibility="visible";
        document.getElementById("undo").style.visibility="hidden";
        document.getElementById("restore").style.visibility="hidden";
        document.getElementById("clear").style.visibility="hidden";
        document.getElementById("save").style.visibility="hidden";

        var inserttime = "<div class='span2' id='timeInHost'><span class='label label-warning'>描く時間</span><div id='toolArea' class='thumbnail alert alert-info'><input type='radio' name='drawtime' id='5' />５秒</br><div id='timebutton'><input type='radio' name='drawtime' id='30' />３０秒</br><input type='radio' name='drawtime' id='60' />１分</br><input type='radio' name='drawtime' id='90' />１分３０秒</br><input type='radio' name='drawtime' id='120' checked='checked'/>２分</br><input type='radio' name='drawtime' id='180' />３分</br></div></div></div>";
        $('#canvasbox').prepend(inserttime);
        var insertdrawuser = "<div class='span2' id='orderInHost'>\n<span class='label label-success'>描く順番\n</span>\n<div id='canvasordernameArea' class='thumbnail alert alert-info'>\n</div>\n</div>\n";
        $('#canvasbox').prepend(insertdrawuser);
        var insertuser = "<div class='span2' id='userInHost'>\n<span class='label label-success'>ログイン中のユーザ\n</span>\n<div id='canvasusernameArea' class='thumbnail alert alert-info'>\n</div>\n</div>\n";
        $('#canvasbox').prepend(insertuser);
        console.log("hostになるを押してからのusers:",users);
        userlist = users.concat();
        updateUserList(userlist,"drawuserNum","canvasusernameArea");
    });


    // ホストで順番決める時に、ユーザのリスト更新.引数はログインユーザの配列、挿入するID、挿入先のID
    function updateUserList(users,addidname,addprependname){
        for(var j = 0; j < users.length + 1; j++){
            $('#'+addidname+j).remove();
        }

        for(var i in users){
            var num = users.length - i -1;
            var insertdrawusername = "<div id='" + addidname + "" + num+"'>"+users[i]+"</div>";
            var insertprependid = "#" + addprependname;
            $(insertprependid).prepend(insertdrawusername);
            console.log(addidname,"です。");
            console.log("これいれた:",users[i]);
            console.log(i,"番目");
            console.log("********");
        }
    }

    // ホストで、ログイン中のユーザをクリックしたら、描く順番へ入れる
    $('#canvasusernameArea div').live("click",function(){
        var clickuser;
        // クリックしたらそのユーザを消す
        for(var i = 0; i < userlist.length; i++){
            if(userlist[i] == $(this).html()){
                clickuser = userlist[i];
                userlist.splice(i,1);
            }
        }

        orderlist.unshift($(this).html());
        updateUserList(orderlist,"orderuserNum","canvasordernameArea");
        updateUserList(userlist,"drawuserNum","canvasusernameArea");
        console.log("ホストでログイン中のユーザをおしてからのuserlist:",userlist);

        if(userlist.length == 0　&& $('#start').hasClass('disabled')){
            $('#start').removeClass('disabled');
            isStart = true;
        }else{
        }
        if(userlist.length == 0) console.log("kara");
        if($('#start').hasClass('disabled')) console.log("aru");
    });

    // ホストで、描く順番をクリックしたら、ログイン中のユーザへ入れる
    $('#canvasordernameArea div').live("click",function(){
        var clickuser;
        // クリックしたらそのユーザを消す
        for(var i = 0; i < orderlist.length; i++){
            if(orderlist[i] == $(this).html()){
                clickuser = orderlist[i];
                orderlist.splice(i,1);
            }
        }

        userlist.unshift($(this).html());
        updateUserList(orderlist,"orderuserNum","canvasordernameArea");
        updateUserList(userlist,"drawuserNum","canvasusernameArea");
        console.log("ホストで描く順番を押してからのusers:",users);

        if(userlist.length != 0 && !$('#start').hasClass('disabled')){
            isStart = false;
            $('#start').addClass('disabled');
        }else{
        }
    });

    // ホストがゲームスタートを押したら
    $('#start').live("click",function(){
        if(isStart){
            var gettime = $("input[name='drawtime']:checked").attr("id");
            socket.emit('order',{
                list: orderlist,
                drawtime: gettime,
            });
            console.log("start");
            console.log("ホストでゲームスタート押してからのusers:",users);
            $('#start').addClass('disabled');
            isStart = false;
        }
    });

    $('#startdraw').live("click",function(){
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
        isDrawable = true;
        document.getElementById("startdraw").style.visibility="hidden";

    });

    $('#newgame').live("click",function(){
        document.getElementById("newgame").style.visibility="hidden";
        socket.emit('newgame',{
            new: true,
        });
        console.log("ホストでnewgameを押してからのusers:",users);
    });

    //canvasエリアにクリックした人の絵を表示
    //途中でログインされると困るかも...
    $('#usernameArea div').live("click",function(){
        if(isGameFin){
            var clickuser = $(this).html();
            for(var i=0; i < orderlist.length; i++){
                if(clickuser == orderlist[i]){
                    var num = i;
                }
            }

            context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
            var img = new Image();
            var d = imglist[num].replace('image/png', 'image/octet-stream');
            img.src = d;
            img.onload = function() {
                context.drawImage(img, 0, 0);
            }

            for(var j = 0; j < users.length ; j++){
                if($('#userNum'+j).html() == clickuser){
                    $('#userNum'+j).css("color","#B94A48");
                }else{
                    $('#userNum'+j).css("color","#3a87ad");
                }
            }

        }
    });

    function saveimg(){
        try {
            var img_png_src = canvas.toDataURL();
            for(var i=0; i < imglist.length; i++){
                var insertimg="<li class='span3' id='imgli'><a href='javascript:void(0)' class='thumbnail'><img id='imgs' border='2px solid #ccc' src='"+imglist[i]+"' name='"+orderlist[i]+"'><h5>"+orderlist[i]+"さんの作品</h5></li></a>";
                $('#image_png').prepend(insertimg);
            }
        } catch(e) {
            console.log(e);
            document.getElementById("image_png").alt = "未対応";
        }
        document.getElementById("toimg").style.visibility="hidden";
    }

    $('#imgli img').live('click',function(){
        if($('#mode').html() != "ゲーム中"){
            url = $(this).attr("src");
            name = $(this).attr("name");

            context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
            var img = new Image();
            var d = url.replace('image/png', 'image/octet-stream');
            img.src = d;
            img.onload = function() {
                context.drawImage(img, 0, 0);
            }

            for(var j = 0; j < users.length ; j++){
                if($('#userNum'+j).html() == name){
                    $('#userNum'+j).css("color","#B94A48");
                }else{
                    $('#userNum'+j).css("color","#3a87ad");
                }
            }
        }
    });

    $('#commentarea').live('keypres',function (e) {
        if(e.keyCode == 13) {
            box = $(this);
            t_val = $(box).val();

            if(t_val.length > 0) {
                socket.emit('comment',{
                    comment: t_val,
                    user: user,
                });
                $(box).val("");
            }
            e.preventDefault();
        }
    });

    $('#layerArea li').live('click',function(){
        var clickli = $(this);
        $('#layerul li:nth-child(n)').each(function(){
            if($(this).attr("id") == clickli.attr("id")){
                $(this).addClass('active');
                canvastype = clickli.attr("id");
                canvastype = Number(canvastype);
                switch(canvastype){
                case 1:
                    context = paint_core(canvas1);
                    break;
                case 2:
                    context = paint_core(canvas2);
                    break;
                case 3:
                    context = paint_core(canvas3);
                    break;
                }

            }else{
                $(this).removeClass('active');
            }
        });

    });

    function renewalComment(commentlist){
        $('#textarea').val("");
        var addcomment = "";
        for(var i=0; i < commentlist.length; i++ ){
            addcomment = addcomment + commentlist[i] + "\n";
        }
        $('#textarea').val(addcomment);
        var dom = $('#textarea');
        dom[0].scrollTop = dom[0].scrollHeight;

    }
}
