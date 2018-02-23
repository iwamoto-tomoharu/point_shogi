export default class Utility {
    public static getPathDir(path: string): string {
        let pathAry = path.split("/");
        return pathAry.slice(0, pathAry.length - 1).join("/");
    }
}
