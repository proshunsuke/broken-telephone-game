/**
 * Created by shunsuke on 14/02/28.
 */
{
    keypressEvent = {
        init: function(){
            $('#titleText').live('keypress',function (e) {
                if(e.keyCode == 13) {
                    gallery.setSearchInfo();
                    sync.emitReqShowImgs();
                    e.preventDefault();
                }
            });

            $('#userText').live('keypress',function (e) {
                if(e.keyCode == 13) {
                    gallery.setSearchInfo();
                    sync.emitReqShowImgs();
                    e.preventDefault();
                }
            });

        }
    }
}