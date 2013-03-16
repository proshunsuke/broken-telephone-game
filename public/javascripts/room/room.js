function Room(){
    this._room_data;
    this._isGetRoom_data;

    this.init = function(){
        this._room_data = new Array();
        this._isGetRoom_data = false;
    }

    this.createrooms = function(roomdata){
        $('#rooms').empty();
        for(var i=0; i < roomdata.length; i++){
            var insertroom="<li class='span3 ' id='"+roomdata[i].room_name+"_li'><a id='"+roomdata[i].room_name+"' class='thumbnail' href='javascript:void(0)'>"+roomdata[i].room_name+"</a><h5 id='"+roomdata[i].room_name+"_hostname'>"+roomdata[i].hostname+"</h5></li>";
            $('#rooms').prepend(insertroom);
            if(roomdata[i].password){
                $('#'+roomdata[i].room_name).css("background-color","#FFFFB0");
                $('#'+roomdata[i].room_name).attr('value','password');
            }
            this.renewal_count(roomdata[i]['count'],roomdata[i]['room_name']);
        }
    }

    this.renewal_count = function(count,room,hostname){
        var room_name = decodeURI(room);
        var insertcount = "<h5 id='"+room_name+"_count'>"+count+"人が参加中</5>";
        $('#'+room_name+'_count').empty();
        $('#'+room_name+'_li').append(insertcount);

        if(hostname){
            $('#'+room_name+'_hostname').html(hostname);
        }

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