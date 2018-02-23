import WebSocketTransceiver from "./WebSocketTransceiver";
import EngineController from "../engine/EngineController";
import EngineResponseData from "../../../lib/data/EngineResponseData";
import AnalysisRequestData from "../../../lib/data/AnalysisRequestData";
import AnalysisResponseData from "../../../lib/data/AnalysisResponseData";

export default class AnalysisTransceiver extends WebSocketTransceiver {
    protected onReceive(message: string): void {
        super.onReceive(message);
        try {
            let messageObj = JSON.parse(message);
            let receiveData: AnalysisRequestData = AnalysisRequestData.fromJSON(messageObj);
            //エンジン実行
            EngineController.instance().exec(receiveData.piecePosition,
                receiveData.engineCommandType, receiveData.engineCommandValue).then(
                (data: EngineResponseData) => {
                    let sendData: AnalysisResponseData = new AnalysisResponseData(data);
                    //エンジン解析結果をクライアントに送信
                    let sendStr: string = JSON.stringify(sendData.toJSON());
                    this.send(sendStr);
                }
            ).catch((err: Error) => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }

}