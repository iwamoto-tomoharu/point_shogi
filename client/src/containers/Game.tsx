import {connect} from "react-redux";
import {Dispatch} from "redux";
import {ReduxAction, ReduxState} from "../Store";
import store from "../Store";
import GameActionDispatcher from "../action_dispatchers/GameActionDispatcher";
import {Game} from "../components/game/Game";

export default connect(
  (state: ReduxState) => ({value: state.game}),
  (dispatch: Dispatch<ReduxAction>) =>
      ({actions: new GameActionDispatcher(dispatch, store)})
)(Game);