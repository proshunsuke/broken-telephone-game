var old_x = 0;
var old_y = 0;
var color;
var size;
var elmSpace;
var context;
var flag = false;
var canpaint = false;
var spaceX;
var spaceY;
var socket;

var remote_down = false;

window.onload = function(){

    socket = io.connect('http://'+location.host+'/');

    var user = document.getElementById('yourname').getAttribute('value');

    jQuery(function($){
        socket.on('connect', function(data) {
            console.log(user);
            //$('#usernameArea').prepend($('<div/>').text(user));
            //$('#usernameArea').prepend($('<div/>').text(data.client_id));
            //console.log("connect session: " + socket.transport.sessionid);

            //console.log(data.sessionID + 'が接続しました。');
            socket.emit('login',{
                user: user,
            });
        });

        socket.on('res',function(from,msg){
            console.log('res# form=' + from + 'msg=' + msg);
        });
        socket.on('updateLoginUsers', function(users){
            console.log('updataLoginUsers# users=' + users);
            updateLoginUsers(users);
        });
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


    socket.on('login',function(data){
        //$('#usernameArea').prepend($('<div/>').text(data.user));
        //console.log("data.users: ",data.users);
        //socket.emit('updateLoginUsers',data.users);
        console.log("loginの処理開始");
        updateLoginUsers(data.users);
    });

    socket.on('logout',function(data){
        console.log(data);
    });

    socket.on('disconnect',function(){
        console.log(socket.sessionID + "が切断しました");
    });

    socket.on('message',function(data){
        switch(data.act){
        case "down":
            remote_down = true;
            context.strokeStyle = data.color;
            context.lineWidth = data.size;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.beginPath();
            context.moveTo(data.x,data.y);
        case "move":
            //console.log("remote: "+data.x,data.y);
            context.lineTo(data.x,data.y);
            context.stroke();
        case "up":
            if(!remote_down) return;
            context.lineTo(data.x,data.y);
            context.stroke();
            context.closePath();
            remote_down = false;
        }
    });


    elmSpace = document.getElementById("space");
    context = elmSpace.getContext('2d');
    elmSpace.addEventListener("mousedown", mouseDown, false);
    elmSpace.addEventListener("mousemove", mouseMove, true);
    elmSpace.addEventListener("mouseup", mouseUp, false);
    spaceX = elmSpace.offsetLeft;
    spaceY = elmSpace.offsetTop;
    //console.log("x座標:",spaceX);
    //console.log("y座標:",spaceY);

}

function mouseDown(event){
    flag = true;
    var rect = event.target.getBoundingClientRect();
    old_x = event.clientX - rect.left;
    old_y = event.clientY - rect.top;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(old_x, old_y);

    socket.emit('message',{
        act: "down",
        x: old_x,
        y: old_y,
        color: context.strokeStyle,
        size: context.lineWidth
    });
}

function mouseMove(event){
    if (!flag) return;

    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();

    //var jsonObj = { "mode": 2, "client_id": client_id, "old_x": old_x, "old_y": old_y, "x": x, "y": y,"color": color,"size":size};
    //sendServer(jsonObj);
    //drawLine(old_x, old_y, x, y,color,size);
    //old_x = x;
    //old_y = y;

    socket.emit('message',{
        act: "move",
        x: x,
        y: y,
    });

    //console.log("x;",x,",y:",y);
}

function mouseUp(event){
    //old_x = 0;
    //old_y = 0;
    if (!flag) return;
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
    flag = false;

    var rect = event.target.getBoundingClientRect();
    socket.emit('message',{
        act: "up",
        x: event.clientX - rect.left,
        y: event.clientX - rect.top,
    });
}

function drawLine(x1,y1,x2,y2,color,size){
    var context = elmSpace.getContext('2d');
    context.lineJoin = "round";
    context.lineCap = "round";
    //context.strokeStyle = color;
    //context.lineWidth = size;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();

}

function changeColor(selectColor) {
    var context = elmSpace.getContext('2d');
    context.strokeStyle = selectColor;
}

function changeSize(selectSize) {
    var context = elmSpace.getContext('2d');
    context.lineWidth = selectSize;
}

function allClear(){
    var context = elmSpace.getContext('2d');
    context.clearRect(0, 0, 600, 300);
    //var jsonObj = { "mode": 3 };
    //sendServer(jsonObj);
}

//test
/* canvasの描画結果をPNGで取り出しimg要素にセット */
function saveimg(){
    try {
        console.log("保存します");
        var canvas = document.getElementById("space");
        var img_png_src = canvas.toDataURL();
        //console.log(img_png_src);
        document.getElementById("image_png").src = img_png_src;
        var insertdiv = "<img src='"+img_png_src+"' alt='test' width='310px'/>";
        $('#image_png').prepend(insertdiv);

        //location.href = img_png_src;
        //document.getElementById("data_url_png").firstChild.nodeValue = img_png_src;
    } catch(e) {
        console.log(e);
        document.getElementById("image_png").alt = "未対応";
    }
    /* canvasの描画結果をJPEGで取り出しimg要素にセット */
    // try {
    //     var img_jpeg_src = canvas.toDataURL("image/jpeg");
    //     document.getElementById("image_jpeg").src = img_jpeg_src;
    //     document.getElementById("data_url_jpeg").firstChild.nodeValue = img_jpeg_src;
    // } catch(e) {
    //     document.getElementById("image_jpeg").alt = "未対応";
    // }
}
var cucCount = 0;
function changeUserColor(){
    var id = "userNum" + cucCount;
    var beforeid = "userNum" + (cucCount - 1);
    if(document.getElementById(id)){
        document.getElementById(id).style.color = "red";
    }
    if(document.getElementById(beforeid))
        document.getElementById(beforeid).style.color = "#3a87ad";
    cucCount = cucCount + 1;
}

function beHost(){
    var user = document.getElementById('yourname').getAttribute('value');
    socket.emit('canparint',{
    });
}
