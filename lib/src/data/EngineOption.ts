import Json from "./api/Json";

export default class EngineOption{

    private _ownBook: boolean = true;
    private _bookFile: string = "book.bin";
    private _resignScore: number = -32600;
    private _threads: number = 8;


    set ownBook(value: boolean) {
        this._ownBook = value;
    }

    set bookFile(value: string) {
        this._bookFile = value;
    }


    set resignScore(value: number) {
        this._resignScore = value;
    }


    set threads(value: number) {
        this._threads = value;
    }

    public static fromJSON(obj: Json): EngineOption {
        const option = new EngineOption();
        option.ownBook = obj._ownBook;
        option.bookFile = obj._bookFile;
        option.resignScore = obj._resignScore;
        option.threads = obj._threads;
        return option;
    }

    public toEngineValue(): {[key: string]: any} {
        const jsonObj: Json = this;
        const engineValue: {[key: string]: any} = {};
        //パスカルケースに変換
        for(let key in jsonObj) {
            const newKey: string = `${key[1].toUpperCase()}${key.slice(2, key.length)}`;
            engineValue[newKey] = jsonObj[key];
        }
        return engineValue;
    }

}
