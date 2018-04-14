import WebSocket = require("ws");
import AnalysisTransceiver from "./transceiver/AnalysisTransceiver";

class Main {
    public static start(): void {
        const port = 8081;
        const wss: WebSocket.Server = new WebSocket.Server({port: port});
        const connections: AnalysisTransceiver[] = [];
        wss.on("connection", (ws: WebSocket) => {
            const connection = new AnalysisTransceiver(ws, () => {
                const pos = connections.indexOf(connection);
                if(pos !== -1) connections.splice(pos, 1);
            });
            connections.push(connection);
            console.debug(`connections length = ${connections.length}`);
        });
        wss.on("error", (error: Error) => {
            console.error(error);
        });

    }
}

Main.start();
