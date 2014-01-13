var Oekaki_list;
Oekaki_list = (function(){

    function Oekaki_list(){
        this.mUsers = new Array();
        this.mImgs = new Array();
    }

    Oekaki_list.prototype.addUserImg = function(user,img){
        this.mUsers.unshift(user);
        this.mImgs.unshift(img);
    }

    Oekaki_list.prototype.recentUserImg = function(user){
        for(var i=0; i < this.mUsers.length; i++){
            if(this.mUsers[i] == user){
                break;
            }
        }
        return this.mImgs[i];
    }

    return Oekaki_list;
})();