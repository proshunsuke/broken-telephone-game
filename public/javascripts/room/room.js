function Room(){

    this.init = function(){
    }

    this.createrooms = function(rooms,creaters,counts){
        $('#rooms').empty();
        for(var i=0; i < rooms.length; i++){
            var insertroom="<li class='span3 ' id='"+rooms[i]+"'><a class='thumbnail' href='/enter?room="+rooms[i]+"'>"+rooms[i]+"</a><h5>"+creaters[i]+"</h5></li>";
            $('#rooms').prepend(insertroom);
            this.renewal_count(counts[i],rooms[i]);
        }

        // for(var i in rooms){
        //     var insertroom = "<li class='span3 ' id='roomli'><a class='thumbnail' href='/enter?room="+rooms[i][0]+"'>"+rooms[i][0]+"</a><h5>"+rooms[i][1]+"</h5></li>";
        // }
    }

    this.renewal_count = function(count,room){
        var room_name = decodeURI(room);
        var insertcount = "<h5 id='"+room_name+"_count'>"+count+"人が参加中</5>";
        $('#'+room_name+'_count').empty();
        $('#'+room_name).append(insertcount);
    }

    this.getQuerystring = function(key, default_){
        if (default_==null) default_="";
        key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if(qs == null)
            return default_;
        else
            return qs[1];
    }



}