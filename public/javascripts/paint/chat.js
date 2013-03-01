function Chat(){
    this._comment_list;

    this.init = function(){
        this._comment_list = new Array();
    }

    this.renewal_comments = function(comment_list){
        $('#textarea').val("");
        var addcomment = "";
        for(var i=0; i < comment_list.length; i++){
            addcomment = addcomment +comment_list[i] + "\n";
        }
        $('#textarea').val(addcomment);
        var dom = $('#textarea');
        dom[0].scrollTop = dom[0].scrollHeight;
    }

    this.write_comment = function(addcomment){
        this._comment_list.push(addcomment);
        this.renewal_comments(this._comment_list);
    }

}