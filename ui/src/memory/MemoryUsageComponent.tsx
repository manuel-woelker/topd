import * as React from "react";
import {MemoryUsage} from "../app/reducers";
import {UsageComponent} from "../app/UsageComponent";

function toFixed(input?: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export class MemoryUsageComponent extends React.Component<{ memoryUsage: MemoryUsage }> {
	render() {
		let memoryUsage = this.props.memoryUsage || {};
		let cellWidth = 60;
		return <UsageComponent title="Memory">
			<div>
				<span style={{color: "#0d551c", fontWeight: "bold"}}>{toFixed(memoryUsage.used * 100)} %</span>
				&nbsp;Used
			</div>
			<div>
				<span style={{color: "#0d3c55", fontWeight: "bold"}}>{toFixed(memoryUsage.buffers * 100)} %</span>
				&nbsp;Buffers
			</div>
			<div>
				<span style={{color: "#76772a", fontWeight: "bold"}}>{toFixed(memoryUsage.cache * 100)} %</span>
				&nbsp;Cache
			</div>
			<div>
				<span style={{color: "#c02e1d", fontWeight: "bold"}}>{toFixed(memoryUsage.swap * 100)} %</span>
				&nbsp;Swap
			</div>
		</UsageComponent>;
	}
}
