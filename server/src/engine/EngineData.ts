export default interface EngineData {
    status: boolean;
    evaluation?: number;
    bestMove?: string;
    isResign?: boolean;
    isNyugyoku?: boolean;
}