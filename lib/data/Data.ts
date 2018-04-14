import Json from "./api/Json";

export default class Data {
    /**
     * Jsonに変換
     * JSON.stringifyで使用される
     * @returns {Json}
     */
    public toJSON(): Json {
        const obj: Json = {};
        for(let key in this) {
            if (this[key] != null && typeof this[key] == "object") {
                obj[key] = this[key].toJSON();
            }else {
                obj[key] = this[key];
            }
        }
        return obj;
    }
}