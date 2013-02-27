function Tool(){
    this.brush1;
    this.brush2;
    this.brush3;
    this.brush4;
    this.brushm;
    this.eraser;


    this._tools = function(){
        this.brush1;
        this.brush2;
        this.brush3;
        this.brush4;
        this.brushm;
        this.eraser;
    }

    this.init = function(){
        this._tools.brush1 = true;
        this._tools.brush2 = false;
        this._tools.brush3 = false;
        this._tools.brush4 = false;
        this._tools.brushm = false;
        this._tools.eraser = false;
    }

    this.change_tool = function(tool){
        for(var i in this._tools){
            this._tools[i] = false;
        }
        this._tools[tool] = true;

        //デバッグ
        // for(var i in this._tools){
        //     console.log("this._tools[",i,"]:",this._tools[i]);
        // }


    }


}
