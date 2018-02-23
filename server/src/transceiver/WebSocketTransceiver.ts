import * as WebSocket from "ws";

export default class WebSocketTransceiver {

    constructor(private ws: WebSocket, private closeListener?: () => void) {
        ws.on("message", (message: WebSocket.Data) => {
            this.onReceive(message.toString());
        });
        ws.on("error", this.onError.bind(this));
        ws.on("close", this.onClose.bind(this));

    }

    protected onReceive(message: string): void {
        console.log(`[client -> server] ${message}`);
    }

    protected onError(error: Error): void {
        console.error(error);
    }

    protected onClose(): void {
        console.log("close");
        if(this.closeListener) this.closeListener();
    }

    protected send(data: string): void {
        console.log(`[client <- server] ${data}`);
        this.ws.send(data);
    }

    protected close(): void {
        this.ws.close();
    }

}
