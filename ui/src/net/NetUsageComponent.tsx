import * as React from "react";
import {NetUsage} from "../app/reducers";
import {UsageComponent} from "../app/UsageComponent";

function toFixed(input?: number) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(3);
}

export class NetUsageComponent extends React.Component<{netUsage: NetUsage}> {
	render() {
		let netUsage = this.props.netUsage || {};
		return <UsageComponent title="Network">
			<div>
				<span style={{color: "#0d3c55", fontWeight: "bold"}}>{toFixed(netUsage.recv/1024/1024)} MB/s</span>
				&nbsp;Receive
			</div>
			<div>
				<span style={{color: "#c02e1d", fontWeight: "bold"}}>{toFixed(netUsage.send/1024/1024)} MB/s</span>
				&nbsp;Send
			</div>
		</UsageComponent>;
	}
}



