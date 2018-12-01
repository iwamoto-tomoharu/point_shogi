import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
interface DialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    okButtonMessage?: string;
    cancelButtonMessage?: string;
    handleYes?: () => void;
    handleNo?: () => void;
    handleClose?: () => void;
}

export class MyDialog extends React.Component<DialogProps, {}> {
    constructor(props: DialogProps, context: any) {
        super(props, context);
    }

    public render(): React.ReactElement<DialogProps> {
        return (
            <div>
                <Dialog
                    open={this.props.isOpen}
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleYes} color="primary" autoFocus>
                            {this.props.okButtonMessage || "はい"}
                        </Button>
                        <Button onClick={this.props.handleNo} color="primary">
                            {this.props.cancelButtonMessage || "いいえ"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}