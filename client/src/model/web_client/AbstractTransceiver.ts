import WebSocketClient from "./WebSocketClient";

export default abstract class AbstractTransceiver {
    protected client: WebSocketClient = WebSocketClient.instance();

    /**
     * WebSocketを閉じる
     */
    public close(): void {
        this.client.close();
    }
}