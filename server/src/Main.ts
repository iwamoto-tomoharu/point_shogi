import WebSocket = require("ws");
import AnalysisTransceiver from "./transceiver/AnalysisTransceiver";

class Main {
    public static start(): void {
        const port = 8081;
        const wss: WebSocket.Server = new WebSocket.Server({port: port});
        let connections: AnalysisTransceiver[] = [];
        wss.on("connection", (ws: WebSocket) => {
            let connection = new AnalysisTransceiver(ws, () => {
                let pos = connections.indexOf(connection);
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
