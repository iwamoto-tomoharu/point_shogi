import * as ChildProcess from "child_process";
import Utility from "../../../lib/utility/Utility";
import EngineData from "../data/EngineData";

export default class Engine {

    //TODO:パラメータ化
    private static readonly ENGINE_PATH: string = "/Users/tomoharu/Documents/Develop/Gikou/bin/gikou";

    private static readonly EVAL_MAX: number = 9999;
    private static readonly EVAL_MIN: number = -9999;


    private child: ChildProcess.ChildProcess;
    private _isEnable: boolean = false;
    private evaluation: number = null;
    private enableListener: () => void;
    private receiveListener: (data: EngineData) => void;
    private regExpListeners: {regExp: RegExp, listener: (recAry: RegExpMatchArray) => void}[] = [
        {regExp: /^usiok/, listener: this.onDataUsiOk.bind(this)},
        {regExp: /^readyok/, listener: this.onDataReadyOk.bind(this)},
        {regExp: /resign/, listener: this.onDataResign.bind(this)},
        {regExp: /win/, listener: this.onDataWin.bind(this)},
        {regExp: /mate (.*)/, listener: this.onDataMate.bind(this)},
        {regExp: /score cp ([-]?[0-9]+)/, listener: this.onDataScoreCp.bind(this)},
        {regExp: / pv (.*)/, listener: this.onDataPv.bind(this)},
        {regExp: /bestmove (.*)/, listener: this.onDataBestMove.bind(this)},
    ];

    /**
     * 利用可能か
     * @returns {boolean}
     */
    get isEnable(): boolean {
        return this._isEnable;
    }

    /**
     * エンジン初期化処理
     */
    public initialize(): Promise<null> {
        return new Promise(
            (resolve: () => void, reject: (err: any) => void) => {
                try {
                    this.child = ChildProcess.spawn(Engine.ENGINE_PATH, [], {cwd: Utility.getPathDir(Engine.ENGINE_PATH)});
                    this.child.stdout.on("data", this.onData.bind(this));
                    this.child.stderr.on("data", this.onError.bind(this));
                    this.child.on("close", this.onClose.bind(this));
                    this.send("usi");
                    this.enableListener = resolve;
                } catch (err) {
                    reject(err);
                }
            }
        );
    }
    /**
     * エンジン実行
     * @returns {boolean}
     */
    public exec(sfen: string, command: string, options: {[key: string]: string}): Promise<EngineData> {
        return new Promise((resolve: (data: EngineData) => void, reject: (err: any) => void) => {
            if(!this._isEnable) {
                resolve({status: false});
                return;
            }
            try {
                for(let key in options) {
                    this.send(`setoption name ${key} value ${options[key]}`);
                }

                this.receiveListener = resolve;
                this.send(`position sfen ${sfen} moves`);
                this.send(`go ${command}`);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * エンジンに送信
     * @param {string} data
     */
    private send(data: string): void {
        console.debug(`[server -> engine] ${data}`);
        this.child.stdin.write(`${data}\n`);
    }

    /**
     * 受信処理
     * @param {string} data
     */
    private onData(data: string): void {
        console.debug(`[engine -> server] ${data}`);
        const recStrs: string[] = data.toString().split("\n");
        for(let recStr of recStrs){
            for(let regExpListener of this.regExpListeners) {
                const recAry = recStr.match(regExpListener.regExp);
                if(!recAry) continue;
                console.debug(`match:${recStr}`);
                regExpListener.listener(recAry);
            }
        }
    }

    /**
     * エラー処理
     * @param {string} data
     */
    private onError(data: string): void {
        console.log(`onError:${data}`);
    }

    /**
     * 終了処理
     * @param {number} code
     * @param {string} signal
     */
    private onClose(code: number, signal: string): void {
        console.log(`onClose:${code} ${signal}`);
    }

    /**
     * usiok受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataUsiOk(recAry: RegExpMatchArray): void {
        this.send("isready");
    }

    /**
     * readyok受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataReadyOk(recAry: RegExpMatchArray): void {
        this._isEnable = true;
        if(this.enableListener) {
            this.enableListener();
            this.enableListener = null;
        }
    }

    /**
     * 投了受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataResign(recAry: RegExpMatchArray): void {
        this.callReceiveListener({status: true, isResign: true, evaluation: Engine.EVAL_MIN});
    }

    /**
     * 入玉勝ち受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataWin(recAry: RegExpMatchArray): void {
        this.callReceiveListener({status: true, isNyugyoku: true, evaluation: Engine.EVAL_MAX});
    }

    /**
     * 詰み受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataMate(recAry: RegExpMatchArray): void {
        if(recAry[1]) {
            const mateVal: number = Number(recAry[1]);
            const evaluation: number = mateVal >= 0 ? Engine.EVAL_MAX : Engine.EVAL_MIN;
            this.callReceiveListener({status: true, evaluation: evaluation});
        } else {
            this.callReceiveListener({status: false});
        }
    }

    /**
     * 評価値受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataScoreCp(recAry: RegExpMatchArray): void {
        if(recAry[1]) {
            //bestmoveを受信した時に使用する
            this.evaluation = Number(recAry[1]);
        }
    }

    /**
     * 読み筋受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataPv(recAry: RegExpMatchArray): void {
        //使用しない
    }

    /**
     * 最善手受信処理
     * @param {RegExpMatchArray} recAry
     */
    private onDataBestMove(recAry: RegExpMatchArray): void {
        if(recAry[1] && this.evaluation != null) {
            const bestMove: string = recAry[1].split(" ")[0];
            this.callReceiveListener({status: true, evaluation: this.evaluation, bestMove: bestMove});
            this.evaluation = null;
        } else {
            this.callReceiveListener({status: false});
        }
    }

    /**
     * 受信リスナーの呼び出し
     * @param {EngineData} data
     */
    private callReceiveListener(data: EngineData): void {
        if(this.receiveListener) {
            this.receiveListener(data);
            this.receiveListener = null;
        }
    }

}