// jsの書き方
// 以下の通りに書く
// letによるブロックスコープを用いる

// 利点: まっとうな方法
//     hack ではなく非常にシンプル
//     private 変数のアクセスには prefix 不要
// 欠点: let によるブロックスコープをサポートするブラウザ限定
//     Firefox 2.0 からサポートされているので拡張機能開発では問題ない
//     public 変数のアクセスには prefix が必要

// 参照：https://dev.mozilla.jp/2010/05/js-blockscope-and-namespace/


{ // ブロックスコープ
    let mPrivate; // private変数 メンバ変数の先頭にはmを付ける
    let kCONST; // 定数の先頭にはkを付ける

    let funcPrivate = function(){}; // private関数

    var howToCodin = { // グローバル名前空間オブジェクト 変数名はファイル名にする

        mPublic: null, // public変数

        init: function(){ // 初期化関数
            mPrivate = "初期化"; // private変数はplefix不必要
        },

        funcPublic: function(){ // public関数
        },

        work: function(){
            alert(mPrivate); // private変数はplefix不必要
            funcPrivate(); // private関数はplefix不必要

            alert(this.mPublic); // public変数はplefix必要
            this.funcPublic(); // public関数はplefix必要
        }

    };
}