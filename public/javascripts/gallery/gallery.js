/**
 * Created by shunsuke on 14/02/24.
 */
{

    let mReqPageNum;
    let mSelectYear;
    let mSelectMonth;
    let mSelectDate;
    let mSelectUser;
    let mSelectTitle;

    let kPageImgsNum = 20;
    let kMaxPaginationNum = 5;

    let addPageNumText = function(i, reqPageNum, pageNumText){
        if(i == reqPageNum){
            pageNumText += "<li class='active'><a href='javascript:void(0)'>"+i+"</a></li>";
        }else{
            pageNumText += "<li><a href='javascript:void(0)'>"+i+"</a></li>";
        }
        return pageNumText;
    }

    var gallery = {

        // getter
        getMreqPageNum: function(){
          return mReqPageNum;
        },

        getMselectYear: function(){
            return mSelectYear;
        },

        getMselectMonth: function(){
            return mSelectMonth;
        },

        getMselectDate: function(){
            return mSelectDate;
        },

        getMselectUser: function(){
            return mSelectUser;
        },

        getMselectTitle: function(){
            return mSelectTitle;
        },

        // setter
        setMreqPageNum: function(reqPageNum){
          mReqPageNum = reqPageNum;
        },

        setMselectYear: function(selectYear){
            mSelectYear = selectYear;
        },

        setMselectMonth: function(selectMonth){
            mSelectMonth = selectMonth;
        },

        setMselectDate: function(selectDate){
            mSelectDate = selectDate;
        },

        setMselectUser: function(selectUser){
            mSelectUser = selectUser;
        },

        setMselectTitle: function(selectTitle){
            mSelectTitle = selectTitle;
        },

        init: function(){
            mReqPageNum = 1;
            mSelectYear = "&nbsp;";
            mSelectMonth = "&nbsp;";
            mSelectDate = "&nbsp;";
            mSelectUser = "";
            mSelectTitle = "";
        },

        toImg: function(imageData){
            $('#image_png').empty();
            for(var i=imageData.length-1; i > -1; i--){
                let insertimg="<li class='span3' id='imgli'>" +
                    "<div class='thumbnail'>" +
                    "<a href='javascript:void(0)' class='thumbnail'>" +
                    "<img id='imgs' border='2px solid #ccc' src='"+imageData[i].img+"' name='"+imageData[i].user+"'></a>" +
                    "<h5>"+imageData[i].user+"さんの作品</h5>" +"<br>" +
                    "<p>タイトル: "+imageData[i].title+"<br>" +
                    ""+imageData[i].year+"年"+imageData[i].month+"月"+imageData[i].date+"日</p></li></div>";
                $('#image_png').append(insertimg);
            }
        },

        // 検索結果が帰ってきた時
        setPagination: function(reqPageNum, imageDataLength){
            reqPageNum = parseInt(reqPageNum);
            $('#paginationUl').empty();

            let maxPageNum = Math.ceil(imageDataLength / kPageImgsNum);

            let backBtnText = "<li><a href='javascript:void(0)' id = 'backBtn'>«</a></li>";
            let forwardBtnText = "<li><a href='javascript:void(0)' id = 'forwardBtn'>»</a></li>";
            let pageNumText = "";

            if(reqPageNum != 1){
                pageNumText += backBtnText;
            }

            if(maxPageNum >= kMaxPaginationNum){ // kMaxPagiationNum分だけ表示
                if(reqPageNum >= (maxPageNum-1)){ // maxPageNumページまで表示しきる
                    for(var i=maxPageNum-(kMaxPaginationNum-1); i < maxPageNum+1; i++){
                        pageNumText = addPageNumText(i, reqPageNum, pageNumText);
                    }
                }else if(reqPageNum <= 2){ // 1ページまで表示しきる
                    for(var i=1; i < kMaxPaginationNum+1; i++){
                        pageNumText = addPageNumText(i, reqPageNum, pageNumText);
                    }
                }else{ // reqPageNumを中心としてkMaxPaginationNum分表示
                    for(var i=reqPageNum-(Math.floor(kMaxPaginationNum/2)); i < reqPageNum+(Math.floor(kMaxPaginationNum/2))+1; i++){
                        pageNumText = addPageNumText(i, reqPageNum, pageNumText);
                    }
                }
            }else{ // maxPageNum分だけ表示
                for(var i=1; i < maxPageNum+1; i++){
                    pageNumText = addPageNumText(i, reqPageNum, pageNumText);
                }
            }

            if(reqPageNum != maxPageNum){
                pageNumText += forwardBtnText;
            }

            $('#paginationUl').append(pageNumText);
        },

        setSearchInfo: function(){
            mSelectYear = $('#visibleValueYear').html();
            mSelectMonth = $('#visibleValueMonth').html();
            mSelectDate = $('#visibleValueDate').html();
            mSelectUser = $('#userText').val();
            mSelectTitle = $('#titleText').val();
            mReqPageNum = 1; // 検索をしたら１ページ目
        }

    }
}
