import * as React from "react";
import {LoadAvg} from "../app/reducers";
import {UsageComponent} from "../app/UsageComponent";

function toFixed(input?: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(2);
}

export class LoadAvgComponent extends React.Component<{loadavg?: LoadAvg}>{
	render() {
		let loadavg = this.props.loadavg || {};
		return <UsageComponent title="Load Average">
			<div>
				<span style={{color: loadavg.color, fontWeight: "bold"}}>{toFixed(loadavg.load_avg_1_min)}</span>
				&nbsp;(1 min)
			</div>
			<div>
				<span style={{color: "#888", fontWeight: "bold"}}>{toFixed(loadavg.load_avg_5_min)}</span>
				&nbsp;(5 min)
			</div>
			<div>
				<span style={{color: "#888", fontWeight: "bold"}}>{toFixed(loadavg.load_avg_10_min)}</span>
				&nbsp;(10 min)
			</div>
		</UsageComponent>;
	}
}
