{
    let mTools;

    var tool = {

        // getter

        getMtools: function(){
            return mTools;
        },

        init :function(){
            mTools = [];
            mTools["brush1"] = true;
            mTools["eraser"] = false;
            mTools["spuit"] = false;
        },

        changeTool :function(tool){
            for(var i in mTools){
                mTools[i] = false;
            }
            mTools[tool] = true;
        }
    };
}