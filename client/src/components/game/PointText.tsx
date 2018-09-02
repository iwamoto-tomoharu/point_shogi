import * as React from "react";

interface PointTextProps {
    point: number;
}

/**
 * 駒
 */
export default class PointText extends React.Component<PointTextProps, {}> {
    public render(): React.ReactElement<PointTextProps> {
        return (
            <div style={{marginLeft: "10%"}}>{this.props.point}</div>
        );
    }

}