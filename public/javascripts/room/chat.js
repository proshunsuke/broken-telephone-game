{ // scope

    let mCommentList;

    let renewalComments = function(commentList){ // private
        $('#textarea').val("");
        let addComment = "";
        for(var i=0; i < commentList.length; i++){
            addComment = addComment +commentList[i] + "\n";
        }
        $('#textarea').val(addComment);
        let dom = $('#textarea');
        dom[0].scrollTop = dom[0].scrollHeight;
    };

    var chat = { // gloval namespace object

        init: function(){ // public
            mCommentList = new Array();
        },

        writeComment: function(addComment){ // public
            mCommentList.push(addComment);
            renewalComments(mCommentList);
        }
    };
}

