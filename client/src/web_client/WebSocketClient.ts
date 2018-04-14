import ApiName from "../../../lib/data/enum/ApiName";
import Json from "../../../lib/data/api/Json";

export default class WebSocketClient {
    private static readonly URL: string = "ws://localhost:8081";
    private static readonly CONNECTION_TIMEOUT_MS: number = 3000;
    private static _instance: WebSocketClient;
    private webSocket: WebSocket;
    private receiveListeners: {[key: number]: (data: Json) => void} = {};

    private constructor() {
    }

    public static instance(): WebSocketClient {
        if(!this._instance) {
            this._instance = new WebSocketClient();
        }
        return this._instance;
    }

    /**
     * 受信リスナーを登録
     * @param {ApiName} apiName
     * @param {(data: Json) => void} listener
     */
    public setReceiveListener(apiName: ApiName, listener: (data: Json) => void): void {
        this.receiveListeners[apiName] = listener;
    }

    /**
     * 接続中か
     * @returns {boolean}
     */
    public isOpen(): boolean {
        if (!this.webSocket){
            return false;
        }
        return this.webSocket.readyState === 1;
    }

    /**
     * 送信
     * @param {Json} data
     * @returns {Promise<any>}
     */
    public async send(data: Json): Promise<any> {
        if(!this.isOpen()) {
            await this.connect();
        }
        const sendData: string = JSON.stringify(data);
        console.log(`[client -> server] ${sendData}`);
        this.webSocket.send(sendData);
    }

    /**
     * 閉じる
     */
    public close(): void {
        this.webSocket.close();
    }

    /**
     * 接続処理
     * @returns {Promise<null>}
     */
    private connect(): Promise<null> {
        return new Promise((resolve, reject) => {
            if(!this.webSocket) {
                this.webSocket = new WebSocket(WebSocketClient.URL);
                //一定時間経過してopenされなかったらタイムアウトエラー
                const timeoutId: number = window.setTimeout(() => {
                    if(this.webSocket) this.webSocket.removeEventListener("open", onOpen);
                    reject(new Error("connection timeout"));
                }, WebSocketClient.CONNECTION_TIMEOUT_MS);

                const onOpen = () => {
                    clearTimeout(timeoutId);
                    this.webSocket.removeEventListener("open", onOpen);
                    resolve();
                };
                this.webSocket.addEventListener("open", onOpen);
                this.webSocket.addEventListener("message", this.onMessage.bind(this));
                this.webSocket.addEventListener("close", this.onClose.bind(this));
                this.webSocket.addEventListener("error", this.onError.bind(this));
            }else {
                resolve();
            }
        });
    }

    /**
     * 受信イベント
     * @param {MessageEvent} event
     */
    private onMessage(event: MessageEvent): void {
        if (!(event && event.data)) return;
        console.log(`[client <- server] ${event.data}`);
        const messageObj: Json = JSON.parse(event.data);
        const apiName: ApiName = Number(messageObj.apiName);
        //登録されていたリスナーを呼び出す
        if(this.receiveListeners.hasOwnProperty(apiName)) {
            this.receiveListeners[apiName](messageObj);
        }
    }

    /**
     * 接続切れイベント
     */
    private onClose(): void {
        console.debug("[Websocket] close");
        this.webSocket = null;
    }

    /**
     * エラーイベント
     * @param {MessageEvent} event
     */
    private onError(event: MessageEvent): void {
        console.error("[WebSocket] error");
        console.error(event);
    }

}