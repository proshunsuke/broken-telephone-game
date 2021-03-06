{ // scope

    let mCommentList;
    let kCommentSize;
    let mIsSizeOver;

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
            mCommentList = [];
            kCommentSize = 50; // コメントは最大５０個
            mIsSizeOver = false;
        },

        writeComment: function(addComment){ // public
            if(mIsSizeOver){
                mCommentList.shift();
            }else if (mCommentList.length > kCommentSize){
                mIsSizeOver = true;
            }
            mCommentList.push(addComment);
            renewalComments(mCommentList);
        }
    };
}

