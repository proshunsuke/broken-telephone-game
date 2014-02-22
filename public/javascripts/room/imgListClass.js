var ImgListClass;
ImgListClass = function(){

    var imgListObj = {
        img: "",
        user: "",
        title: ""
    };

    var imgListMain = new Array();

    ImgListClass.prototype.imgListUnshift = function(img,user,title){
        var imgListHash = {img: img, user: user, title: title};
        this.unshift(imgListHash);
    }

    Array.prototype.recentUserImg = function(user){
        for(var i=0; i < this.length; i++){
            if(this[i].user == user){
                break;
            }
        }
        return this[i].img;
    }

    return imgListMain;
}