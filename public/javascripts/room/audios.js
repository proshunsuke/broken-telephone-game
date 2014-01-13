{ // scope

    let mAudio;

    var audios = {

        init : function(soundFileMp3,soundFileOgg) { // public
            mAudio = new Audio("");
            mAudio.autoplay = false;
            if (mAudio.canPlayType) {
                let mCanPlayOgg = ("" != mAudio.canPlayType("audio/ogg"));
                let mCanPlayMp3 = ("" != mAudio.canPlayType("audio/mpeg"));

                if (mCanPlayOgg) {
                    // oggをサポートしている
                    mAudio.src = soundFileOgg;
                } else if (mCanPlayMp3) {
                    // mp3をサポートしている
                    mAudio.src = soundFileMp3;
                } else {
                    throw "oggもmp3もサポートしていません";
                }
            } else {
                console.log("canPlayTypeメソッドが存在しません");
                throw "canPlayTypeメソッドが存在しません";
            }
        },

        // 再生
        play : function() {
            mAudio.play();
        },

        // 先頭から再生
        playFromStart : function() {
            mAudio.load();
            mAudio.play();
        },

        // 一時停止
        pause : function() {
            mAudio.pause();
        },

        // 停止
        stop : function() {
            if (mAudio.ended) {
                mAudio.pause();
                mAudio.currentTime = 0;
            }
        }
    };
}