import * as React from "react";
import * as styles from "../scss/HeadButtons.scss";
import Props from "./Props";
import Button from "@material-ui/core/Button";
import {MyDialog} from "../util/MyDialog";

export class HeadButtons extends React.Component<Props, {}> {
    public render(): React.ReactElement<Props> {
        return (
            <div className={styles.headButton}>
                <Button onClick={() => this.props.actions.start()}
                        variant="contained" color="secondary" className={styles.gameStartButton}>
                    対局開始
                </Button>
                <Button onClick={() => this.props.actions.openResignDialog()}
                        variant="contained" color="primary" className={styles.resignButton}>
                    投了
                </Button>
                <Button variant="contained" color="primary" className={styles.retractButton}>
                    待った
                </Button>
                <MyDialog isOpen={this.props.value.isOpenResignDialog}
                          title={"投了しますか？"}
                          handleYes={() => this.props.actions.resign()}
                          handleClose={() => this.props.actions.closeResignDialog()}
                          handleNo={() => this.props.actions.closeResignDialog()}/>
            </div>
        );
    }
}