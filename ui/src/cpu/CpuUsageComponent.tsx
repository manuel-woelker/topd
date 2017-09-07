import * as React from "react";
import {CpuUsage} from "../app/reducers";

function toFixed(input: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export class CpuUsageComponent extends React.Component<{cpu_usage: CpuUsage}> {
	render() {
		let cpu_usage = this.props.cpu_usage || {};
		return <div>
			<div className="diagram-header" style={{width: 200, display: "inline-block"}}>CPU Usage</div>
					<div style={{display: "inline-block", width: 80, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(cpu_usage.user*100)} %</div>
					<div style={{display: "inline-block", width: 80}}>&nbsp;User</div>
					<div style={{display: "inline-block", width: 80, color: "#c02e1d", fontWeight: "bold", textAlign: "right"}}>{toFixed(cpu_usage.system*100)} %</div>
					<div style={{display: "inline-block", width: 80}}>&nbsp;System</div>
					<div style={{display: "inline-block", width: 80, color: "#76772a", fontWeight: "bold", textAlign: "right"}}>{toFixed(cpu_usage.other*100)} %</div>
					<div style={{display: "inline-block", width: 80}}>&nbsp;Other</div>
		</div>;
	}
}
