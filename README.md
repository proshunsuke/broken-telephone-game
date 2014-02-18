broken-telephone-game
=====================
「お絵かき伝言ゲーム」です。

URLはこちら：

http://broken-telephone-game.herokuapp.com/

http://www15181ui.sakura.ne.jp:3000/

お絵かき伝言ゲームとは
----------------------
通常の伝言ゲームは「言葉」を伝えていきますが、お絵かき伝言ゲームでは「絵」を伝えていきます。

その名の通り「お絵かき伝言ゲーム」です。

前の人の絵を見て、その絵をたよりに絵を描いて、そしてその絵を伝えていく・・・。

とっても簡単なゲームです。気軽に遊んでください！

ローカルでの動かし方
--------------------
### 必要なもの ###
+ `node.js`
+ `mongoDB`

予めインストールしておいてください。

### 手順 ###

mongoDBを起動します。

    $ mongoDBのパス/bin/gongod --nojournal --noprealloc --dbpath mongoDBのパス/db/

node.jsを起動します。

    $ node app.js

[http://localhost:3000/](http://localhost:3000/) にアクセスします。
