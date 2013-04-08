function Audio(sound_file_mp3,sound_file_ogg){
    this._audio;

    this.init = function(){
        this._audio = new Audio("");
        this._audio.autoplay = false;
        // if(this._audio.canPlayType){
            var canPlayOgg = ("" != this._audio.canPlayType("audio/ogg"));
            var canPlayMp3 = ("" != this._audio.canPlayType("audio/mpeg"));

            if(canPlayOgg){
                // oggをサポートしている
                this._audio.src = sound_file_ogg;
            }else if(canPlayMp3){
                // mp3をサポートしている
                this._audio.src = sound_file_mp3;
            }else{
                throw "oggもmp3もサポートしていません";
            }
        // }else{
        //     console.log("canPlayTypeメソッドが存在しません");
        //     throw "canPlayTypeメソッドが存在しません";
        // }
        console.log("audio:",this._audio);
    }

    // 再生
    this.play = function(){
        this._audio.play();
    }

    // 先頭から再生
    this.play_from_start = function(){
        this._audio.load();
        this._audio.play();
    }

    // 一時停止
    this.pause = function(){
        this._audio.pause();
    }

    // 停止
    this.stop = function(){
        if(this._audio.ended){
            this._audio.pause();
            this._audio.currentTime = 0;
        }
    }

}