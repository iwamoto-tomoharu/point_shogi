import Json from "./api/Json";

export default class Data {
    /**
     * Jsonに変換
     * JSON.stringifyで使用される
     * @returns {Json}
     */
    public toJSON(): Json {
        const obj: Json = {};
        const that: {[key: string]: any} = this;
        for(let key in that) {
            if (that[key] != null && typeof that[key] == "object") {
                obj[key] = that[key].toJSON();
            }else {
                obj[key] = that[key];
            }
        }
        return obj;
    }
}