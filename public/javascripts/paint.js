var user;
var users =[];
var imglist = [];
var context;
var canvas;
var drawtime;
var isClickHost = false;
var isDrawable = true;
var isGameFin = false;

window.onload = function(){
    var insertpagename = "<li class='active' id='paint'><a href='/paint'>Paint</a></li>";
    $('#nav-ul').append(insertpagename);

    socket = io.connect();
    // socket = io.connect('http://'+location.host+'/');
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
        //$('#usernameArea').prepend($('<div/>').text(data.user));
        //console.log("data.users: ",data.users);
        //socket.emit('updateLoginUsers',data.users);
        users = data.users.concat();
        console.log("loginの処理開始");
        updateLoginUsers(users);
        if (isClickHost){
            //ホストのログインユーザを更新
            userlist.unshift(data.users[0]);
            updateUserList(userlist,"drawuserNum","canvasusernameArea");
        }
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
        setFinalTime(data.drawtime);
        drawtime = data.drawtime;

        //ホストのcanvasを復活
        if(isClickHost){
            $('#canvasbox #orderInHost').remove();
            $('#canvasbox #userInHost').remove();
            $('#canvasbox #timeInHost').remove();

            document.getElementById("canvasArea").style.display="block";
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
            //timelimit(data.drawtime);
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
        isGameFin = false;
        $('#finishtime').html("終了予定；");
        $('#userslist').html('ログイン中のユーザ');
        $('#mode').html("待機中");
        document.getElementById("host").style.visibility="visible";
        updateLoginUsers(users);
        orderlist = [];
        userlist = [];
        imglist = [];
    });

    //ホストの決定ボタンと描き始めるボタンを非表示に
    document.getElementById("start").style.visibility="hidden";
    document.getElementById("startdraw").style.visibility="hidden";
    document.getElementById("newgame").style.visibility="hidden";



}

$(function() {
    var offset = 5;
    var startX;
    var startY;
    var brushSize = 10;
    var alphaSize = 1;
    var brushColor = '#000000';
    var flag = false;
    canvas = $('canvas').get(0);
    if (canvas.getContext) {
        context = canvas.getContext('2d');
    }

    // var picker = $.farbtastic('#colorpicker');
    // picker.linkTo($("#color"));

    $('#back1').click(function(e) {
        $('canvas').css({'background-color':'#FFFFFF','background-image':'none'});
    });
    $('#back2').click(function(e) {
        $('canvas').css({'background-color':'#000000','background-image':'none'});
    });
    $('#back3').click(function(e) {
        $('canvas').css('background-image','url(back.gif)');
    });

    $("#slider").slider({
        min: 1,
        max: 100, // ブラシの最大サイズ
        value : 10,  // 最初のブラシサイズ
        slide : function(evt, ui){
            brushSize = ui.value; // ブラシサイズを設定
            $("#bw").val(brushSize);
        }
    });

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

        $('#bw').val($('#slider').slider('value'));
        $('#alpha').val($('#slider2').slider('value'));
        //$('#slider2').css({'background-image':'url(alpha.gif)','background-position':'0px -2px'});

    $('#colorArea td').addClass('ofclic');
    $('#colorArea td').click(function() {
        clic_color = new RGBColor($(this).css('background-color'));
        // picker.setColor(clic_color.toHex());
        $('#colorArea td').removeClass('clic');
        $(this).addClass('clic');


        $("#newcolor").css("background-color",clic_color.toHex());

        //console.log(document.getElementById($('#colorlist')));

    });

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
        // picker.setColor(spuit_color.toHex());
        }
        }
    });

    $('canvas').mousedown(function(e) {
        if(isDrawable){
        undoImage = context.getImageData(0, 0, $('canvas').width(), $('canvas').height());
        flag = true;
        startX = e.pageX - $(this).offset().left - offset;
        startY = e.pageY - $(this).offset().top - offset;
        return false; // for chrome
        }
    });

    $('canvas').mousemove(function(e) {
        if(isDrawable){
        if (flag) {
            var endX = e.pageX - $('canvas').offset().left - offset;
            var endY = e.pageY - $('canvas').offset().top - offset;

            // var brushColor = picker.color;
            var brushColor = $("#newcolor").css("background-color");
            var getBrush1 = $('#brush1').is(':checked');
            var getBrush2 = $('#brush2').is(':checked');
            var getBrush3 = $('#brush3').is(':checked');
            var getBrush4 = $('#brush4').is(':checked');
            var getBrushm = $('#miter').is(':checked');
            var getEeraser = $('#eraser').is(':checked');

        //ブラシ（通常）
        if(getBrush1 == true){
            context.globalAlpha = alphaSize;
            context.beginPath();
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = brushColor;
            context.lineWidth = brushSize;
            context.lineJoin= 'round';
            context.lineCap = 'round';
            context.shadowBlur = 0;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.closePath();

        //ブラシ（ぼかし１）
        }else if(getBrush2 == true){
            context.globalAlpha = alphaSize;
            context.beginPath();
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = brushColor;
            context.lineWidth = brushSize;
            context.lineJoin= 'round';
            context.lineCap = 'round';
            context.shadowBlur = brushSize;
            context.shadowColor = brushColor;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.closePath();

        //ブラシ（ぼかし２）
        }else if(getBrush3 == true){
            brushSizex2 = brushSize + brushSize;
            context.globalAlpha = alphaSize;
            context.beginPath();
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = brushColor;
            context.lineWidth = brushSize;
            context.lineJoin= 'round';
            context.lineCap = 'round';
            context.shadowBlur = brushSizex2;
            context.shadowColor = brushColor;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.closePath();

        //ブラシ（パステル）
        }else if(getBrush4 == true){
            context.globalAlpha = 0.1;
            context.beginPath();
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = '#ffffff';
            context.lineWidth = brushSize;
            context.lineJoin= 'miter';
            context.lineCap = 'butt';
            context.shadowBlur = brushSize;
            context.shadowColor = brushColor;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.closePath();

        //ブラシ（四角）
        }else if(getBrushm == true){
            context.globalAlpha = alphaSize;
            context.beginPath();
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = brushColor;
            context.lineWidth = brushSize;
            context.lineJoin= 'miter';
            context.lineCap = 'butt';
            context.shadowBlur = 0;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.closePath();

        //消しゴム
        }else if(getEeraser == true){
            context.globalAlpha = 1;
            context.beginPath();
            context.globalCompositeOperation = 'destination-out';
            context.strokeStyle = '#000000';
            context.lineWidth = brushSize;
            context.lineJoin= 'round';
            context.lineCap = 'round';
            context.shadowBlur = 0;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.closePath();
        }
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

});

// ここからホストの処理
var userlist;
var orderlist = [];

function beHost(){
    isClickHost = true;

    socket.emit('host',{
        isClickHost: true,
        hostname: user,
    });

    //$('canvas').remove();
    //$('#canvasbox #button').remove();
    document.getElementById("canvasArea").style.display="none";
    document.getElementById("start").style.visibility="visible";
    document.getElementById("undo").style.visibility="hidden";
    document.getElementById("restore").style.visibility="hidden";
    document.getElementById("clear").style.visibility="hidden";
    document.getElementById("save").style.visibility="hidden";


    //var insertdiv = "<div id ='selectArea' width='600' height='400'></div>";
    //$('#canvasbox').prepend(insertdiv);
    // var insertbutton = "<div id='decidebt' class='span8'><a class='btn'>決定</a></div>";
    // $('#canvasbox').prepend(insertbutton);
    var inserttime = "<div class='span2' id='timeInHost'><span class='label label-warning'>描く時間</span><div id='toolArea' class='thumbnail alert alert-info'><input type='radio' name='drawtime' id='5' />５秒</br><div id='timebutton'><input type='radio' name='drawtime' id='30' />３０秒</br><input type='radio' name='drawtime' id='60' />１分</br><input type='radio' name='drawtime' id='90' />１分３０秒</br><input type='radio' name='drawtime' id='120' checked='checked'/>２分</br><input type='radio' name='drawtime' id='180' />３分</br></div></div></div>";
    $('#canvasbox').prepend(inserttime);
    var insertdrawuser = "<div class='span2' id='orderInHost'>\n<span class='label label-success'>描く順番\n</span>\n<div id='canvasordernameArea' class='thumbnail alert alert-info'>\n</div>\n</div>\n";
    $('#canvasbox').prepend(insertdrawuser);
    var insertuser = "<div class='span2' id='userInHost'>\n<span class='label label-success'>ログイン中のユーザ\n</span>\n<div id='canvasusernameArea' class='thumbnail alert alert-info'>\n</div>\n</div>\n";
    $('#canvasbox').prepend(insertuser);
    // for(var i in users){
    //     var num = users.length - i -1;
    //     var insertdrawusername = "<div id ='drawuserNum"+num+"'>"+users[i]+"</div>";
    //     $('#canvasusernameArea').prepend(insertdrawusername);
    // }
    console.log("hostになるを押してからのusers:",users);
    userlist = users.concat();
    updateUserList(userlist,"drawuserNum","canvasusernameArea");
};


// ホストで順番決める時に、ユーザのリスト更新.引数はログインユーザの配列、挿入するID、挿入先のID
function updateUserList(users,addidname,addprependname){
    for(var j = 0; j < users.length + 1; j++){
        //$('#drawuserNum'+j).remove();
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
    console.log("ホストでログイン中のユーザをおしてからのusers:",users);
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
});

// ホストがゲームスタートを押したら
$('#start').live("click",function(){
    var gettime = $("input[name='drawtime']:checked").attr("id");
    socket.emit('order',{
        list: orderlist,
        drawtime: gettime,
    });
    console.log("start");
    console.log("ホストでゲームスタート押してからのusers:",users);
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
        //console.log(img_png_src);
        //document.getElementById("image_png").src = img_png_src;
        for(var i=0; i < imglist.length; i++){
            var insertdiv = "<img src='"+imglist[i]+"' alt='test' width='310px'/>";
            $('#image_png').prepend(insertdiv);
        }
        //location.href = img_png_src;
        //document.getElementById("data_url_png").firstChild.nodeValue = img_png_src;
    } catch(e) {
        console.log(e);
        document.getElementById("image_png").alt = "未対応";
    }
}


