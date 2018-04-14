import game, {GameActions, GameState} from "./modules/GameModule";
import {createStore, combineReducers, applyMiddleware, Action} from "redux";
import logger from "redux-logger";

export default createStore(
    combineReducers({
        game,
  }),
    applyMiddleware(logger)
);

export type ReduxState = {
    game: GameState,
};

export type ReduxAction =
    GameActions |
    Action;
