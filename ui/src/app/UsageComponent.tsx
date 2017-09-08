import * as React from "react";

export class UsageComponent extends React.Component<{ title: string }> {
	render() {
		return <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px"}}>
			<div className="diagram-header">{this.props.title}</div>
			{React.Children.map(this.props.children, (child) => {
				return <div>{child}</div>;
			})}
		</div>;
	}
}
