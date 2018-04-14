import * as React from "react";
import * as ReactDOM from "react-dom";
import store from "./Store";
import {Provider} from "react-redux";
import Game from "./containers/Game";
import Main from "./components/Main";

ReactDOM.render(
    <Main>
        <Provider store={store}>
            <Game />
        </Provider>
    </Main>
  , document.getElementById("app")
);