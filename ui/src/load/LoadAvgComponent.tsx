import * as React from "react";
import {LoadAvg} from "../app/reducers";

function toFixed(input?: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(2);
}

export class LoadAvgComponent extends React.Component<{loadavg?: LoadAvg}>{
	render() {
		let loadavg = this.props.loadavg || {};
		return <div>
			<div style={{width: 200, fontSize: "30px", display: "inline-block"}}>Load Average</div>
			<div style={{display: "inline-block", width: 100, color: loadavg.color, fontWeight: "bold", textAlign: "right"}}>{toFixed(loadavg.load_avg_1_min)}</div>
			<div style={{display: "inline-block", width: 100}}>&nbsp;(1 min)</div>
			<div style={{display: "inline-block", width: 100, color: "#888", fontWeight: "bold", textAlign: "right"}}>{toFixed(loadavg.load_avg_5_min)}</div>
			<div style={{display: "inline-block", width: 100}}>&nbsp;(5 min)</div>
			<div style={{display: "inline-block", width: 100, color: "#888", fontWeight: "bold", textAlign: "right"}}>{toFixed(loadavg.load_avg_10_min)}</div>
			<div style={{display: "inline-block", width: 100}}>&nbsp;(10 min)</div>
		</div>;
	}
}
