import Json from "./api/Json";
import ApiData from "./api/ApiData";
import Data from "./Data";

export default class EngineOption extends Data{

    private _ownBook: boolean = true;
    private _bookFile: string = "book.bin";
    private _resignScore: number = -32600;


    set ownBook(value: boolean) {
        this._ownBook = value;
    }

    set bookFile(value: string) {
        this._bookFile = value;
    }


    set resignScore(value: number) {
        this._resignScore = value;
    }

    public static fromJSON(obj: Json): EngineOption {
        const option = new EngineOption();
        option.ownBook = obj._ownBook;
        option.bookFile = obj._bookFile;
        option.resignScore = obj._resignScore;
        return option;
    }

    public toEngineValue(): {[key: string]: any} {
        const jsonObj: Json = this.toJSON();
        const engineValue: {[key: string]: any} = {};
        //パスカルケースに変換
        for(let key in jsonObj) {
            const newKey: string = `${key[1].toUpperCase()}${key.slice(2, key.length)}`;
            engineValue[newKey] = jsonObj[key];
        }
        return engineValue;
    }

}
