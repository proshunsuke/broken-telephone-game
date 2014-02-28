/**
 * Created by shunsuke on 14/02/27.
 */
{
    mouseEvent = {
        init: function(){

            $('.dropdown-menu a').click(function(){
                //反映先の要素名を取得
                var visibleTag = $(this).parents('ul').attr('visibleTag');
                var hiddenTag = $(this).parents('ul').attr('hiddenTag');
                //選択された内容でボタンの表示を変える
                $(visibleTag).html($(this).attr('value'));
                //選択された内容でhidden項目の値を変える
                $(hiddenTag).val($(this).attr('value'));
            });

            $('#searchStartBtn').click(function(){
                gallery.setSearchInfo();
                sync.emitReqShowImgs();
            });

            $('#paginationUl a').live("click",function(){
                if($(this).attr("id") == 'backBtn'){
                    gallery.setMreqPageNum(parseInt(gallery.getMreqPageNum())-1);
                }else if($(this).attr("id") == 'forwardBtn'){
                    gallery.setMreqPageNum(parseInt(gallery.getMreqPageNum())+1);
                }else{
                    gallery.setMreqPageNum($(this).html());
                }
                gallery.setMselectYear($('#visibleValueYear').html());
                gallery.setMselectMonth($('#visibleValueMonth').html());
                gallery.setMselectDate($('#visibleValueDate').html());
                gallery.setMselectUser($('#userText').val());
                gallery.setMselectTitle($('#titleText').val());
                sync.emitReqShowImgs();
            });
        }
    }
}
