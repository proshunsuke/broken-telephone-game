window.onload = function(){
    var pagename = $('#page').attr('name');
    $('#'+pagename).addClass("active");
    toInstance();
}