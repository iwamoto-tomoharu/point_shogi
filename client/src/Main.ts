import PiecePosition from "../../lib/data/PiecePosition";
import AnalysisRequestData from "../../lib/data/AnalysisRequestData";
import EngineCommandType from "../../lib/data/enum/EngineCommandType";
import AnalysisResponseData from "../../lib/data/AnalysisResponseData";

let ws: WebSocket = new WebSocket("ws://localhost:8081");
ws.onopen = () => {
    let piecePosition: PiecePosition = new PiecePosition();
    let requestData: AnalysisRequestData = new AnalysisRequestData(piecePosition, EngineCommandType.nodes, 100000);
    let message: string = JSON.stringify(requestData.toJSON());
    ws.send(message);
    console.log(`[client -> server] ${message}`);
};

ws.onmessage = (e) => {
    console.log(`[client <- server] ${e.data}`);
    let data = JSON.parse(e.data);
    let responseData: AnalysisResponseData = AnalysisResponseData.fromJSON(data);
    console.log(responseData);
};

ws.onclose = () => {
    console.log("close");
};

window.addEventListener("beforeunload", () => {
    ws.close();
});