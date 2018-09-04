import AnalysisResponseData from "../../../../lib/data/api/AnalysisResponseData";
import AnalysisRequestData from "../../../../lib/data/api/AnalysisRequestData";
import ApiName from "../../../../lib/data/enum/ApiName";
import Json from "../../../../lib/data/api/Json";
import AbstractTransceiver from "./AbstractTransceiver";

export default class AnalysisTransceiver extends AbstractTransceiver {

    /**
     * 解析実行
     * @param {AnalysisRequestData} requestData
     * @returns {Promise<AnalysisResponseData>}
     */
    public analyze(requestData: AnalysisRequestData): Promise<AnalysisResponseData> {
        return new Promise<AnalysisResponseData>(
            (resolve, reject) => {
                this.client.setReceiveListener(requestData.apiName, (data: Json) => {
                    resolve(AnalysisResponseData.fromJSON(data));
                });
                this.client.send(requestData)
                    .catch((err: Error) => {
                        reject(err);
                    });

            }
        );
    }

}
