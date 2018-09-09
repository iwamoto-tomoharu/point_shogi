import Json from "./data/api/Json";

//TODO: log4jsを使う
export default class Logger {
    public static httpRequest(data: Json): void {
        this.json("[client -> server]", data);
    }
    public static httpResponse(data: Json): void {
        this.json("[server -> client]", data);
    }

    private static json(header: string, data: Json): void {
        console.log(`${header} ${JSON.stringify(data)}`);

    }

}