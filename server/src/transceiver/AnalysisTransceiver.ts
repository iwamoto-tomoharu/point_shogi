import WebSocketTransceiver from "./WebSocketTransceiver";
import EngineController from "../engine/EngineController";
import EngineResponseData from "../../../lib/data/EngineResponseData";
import AnalysisRequestData from "../../../lib/data/api/AnalysisRequestData";
import AnalysisResponseData from "../../../lib/data/api/AnalysisResponseData";

export default class AnalysisTransceiver extends WebSocketTransceiver {
    protected onReceive(message: string): void {
        super.onReceive(message);
        const messageObj = JSON.parse(message);
        const receiveData: AnalysisRequestData = AnalysisRequestData.fromJSON(messageObj);
        //エンジン実行
        (async () => {
            const data: EngineResponseData = await EngineController.instance()
                .exec(receiveData.piecePosition, receiveData.engineCommand, receiveData.engineOption);
            const sendData: AnalysisResponseData = new AnalysisResponseData(receiveData.apiName, data);
            //エンジン解析結果をクライアントに送信
            const sendStr: string = JSON.stringify(sendData);
            this.send(sendStr);
        })();
    }

}