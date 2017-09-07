import * as React from "react";
import {MemoryUsage} from "../app/reducers";

function toFixed(input?: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export class MemoryUsageComponent extends React.Component<{memoryUsage: MemoryUsage}> {
	render() {
		let memoryUsage = this.props.memoryUsage || {};
		let cellWidth = 60;
		return <div>
			<div className="diagram-header" style={{width: 200, display: "inline-block"}}>Memory</div>
			<div
				style={{display: "inline-block", width: cellWidth, color: "#0d551c", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.used * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: cellWidth}}>&nbsp;Used</div>
			<div
				style={{display: "inline-block", width: cellWidth, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.buffers * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: cellWidth}}>&nbsp;Buffers</div>
			<div
				style={{display: "inline-block", width: cellWidth, color: "#76772a", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.cache * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: cellWidth}}>&nbsp;Cache</div>
			<div
				style={{display: "inline-block", width: cellWidth, color: "#c02e1d", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.swap * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: cellWidth}}>&nbsp;Swap</div>
		</div>;
	}
}
