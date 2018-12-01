import * as Express from "express";
import EngineController from "../../engine/EngineController";
import Logger from "../../../../lib/src/Logger";
import AnalysisRequestData from "../../../../lib/src/data/api/AnalysisRequestData";
import AnalysisResponseData from "../../../../lib/src/data/api/AnalysisResponseData";
import EngineResponseData from "../../../../lib/src/data/EngineResponseData";

class AnalysisRouter {
    public static create(): Express.Router {
        const router = Express.Router();
        router.post("/", this.root.bind(this));
        return router;
    }

    private static root(req: Express.Request, res: Express.Response): void {
        Logger.httpRequest(req.body);
        const reqData: AnalysisRequestData = AnalysisRequestData.fromJSON(req.body);
        (async () => {
            const resData = await this.execEngine(reqData);
            Logger.httpResponse(resData);
            res.json(resData);
        })();
    }

    private static async execEngine(reqData: AnalysisRequestData): Promise<AnalysisResponseData> {
        const data: EngineResponseData = await EngineController.instance()
            .exec(reqData.piecePosition, reqData.engineCommand, reqData.engineOption);
        return new AnalysisResponseData(reqData.apiName, data);
    }
}

export default AnalysisRouter.create();
