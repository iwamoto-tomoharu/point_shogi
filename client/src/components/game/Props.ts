import {GameState} from "../../modules/GameModule";
import GameActionDispatcher from "../../action_dispatchers/GameActionDispatcher";

export default interface Props {
    value: GameState;
    actions: GameActionDispatcher;
}
