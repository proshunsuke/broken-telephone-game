var Oekaki_list;
Oekaki_list = (function(){

    function Oekaki_list(){
        this._users = new Array();
        this._imgs = new Array();
    }

    Oekaki_list.prototype.add_user_img = function(user,img){
        this._users.unshift(user);
        this._imgs.unshift(img);
    }

    Oekaki_list.prototype.recent_user_img = function(user){
        for(var i=0; i < this._users.length; i++){
            if(this._users[i] == user){
                break;
            }
        }
        return this._imgs[i];
    }

    return Oekaki_list;
})();