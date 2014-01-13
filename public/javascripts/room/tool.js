{

    let mBrush1;
    let mBrush2;
    let mBrush3;
    let mBrush4;
    let mBrushm;
    let mEraser;

    var tool = {

        mTools :function(){
            mBrush1;
            mBrush2;
            mBrush3;
            mBrush4;
            mBrushm;
            mEraser;
        },

        init :function(){
            mBrush1 = true;
            mBrush2 = false;
            mBrush3 = false;
            mBrush4 = false;
            mBrushm = false;
            mEraser = false;
        },

        changeTool :function(tool){
            for(var i in this.mTools){
                this.mTools[i] = false;
            }
            this.mTools[tool] = true;
        }
    };
}