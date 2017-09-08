import * as React from "react";
import {CpuUsage} from "../app/reducers";
import {UsageComponent} from "../app/UsageComponent";

function toFixed(input: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export class CpuUsageComponent extends React.Component<{cpu_usage: CpuUsage}> {
	render() {
		let cpu_usage = this.props.cpu_usage || {};
		return <UsageComponent title="CPU Usage">
			<div>
				<span style={{color: "#0d3c55", fontWeight: "bold"}}>{toFixed(cpu_usage.user*100)} %</span>
				&nbsp;User
			</div>
			<div>
				<span style={{color: "#c02e1d", fontWeight: "bold"}}>{toFixed(cpu_usage.system*100)} %</span>
				&nbsp;System
			</div>
			<div>
				<span style={{color: "#76772a", fontWeight: "bold"}}>{toFixed(cpu_usage.other*100)} %</span>
				&nbsp;Other
			</div>
		</UsageComponent>;
	}
}
