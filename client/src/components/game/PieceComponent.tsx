import * as React from "react";
import PieceType from "../../../../lib/data/enum/PieceType";
import Piece from "../../../../lib/data/Piece";

interface PieceProps {
    piece: Piece;
    className: string;
}

/**
 * 駒
 */
export default class PieceComponent extends React.Component<PieceProps, {}> {
    public render(): React.ReactElement<PieceProps> {
        const pieceName = PieceType[this.props.piece.type];
        const sengo = this.props.piece.isSente ? "sente" : "gote";
        return (
            <img src={`image/game/piece/${sengo}/${pieceName}.png`}
                 className={this.props.className}
            />
        );
    }

}