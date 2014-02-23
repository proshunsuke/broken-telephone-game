/**
 * Created by shunsuke on 14/02/24.
 */
{
    var gallery = {
        init: function(){

        },

        toImg: function(imageData){
            $('#image_png').empty();
            for(var i=0; i < imageData.length; i++){
                let insertimg="<li class='span3' id='imgli'><a href='javascript:void(0)' class='thumbnail'><img id='imgs' border='2px solid #ccc' src='"+imageData[i].img+"' name='"+imageData[i].user+"'><h5>"+imageData[i].user+"さんの作品</h5></li></a>";
                $('#image_png').append(insertimg);
            }
        }
    }
}
