import * as React from "react";
import {DiskUsage} from "../app/reducers";

function toFixed(input: number) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(0);
}

export class DiskUsageComponent extends React.Component<{diskUsage?: DiskUsage}> {
	render() {
		let diskUsage = this.props.diskUsage || {};
		let disks: {disk: string, value: number}[] = [];
		for(var disk in diskUsage) {
			disks.push({disk: disk, value: diskUsage[disk]});
		}
		return <div>
			<div className="diagram-header" style={{width: 200, display: "inline-block"}}>Disk Usage</div>
			{
				disks.map((disk) => {
					return <div key={disk.disk} style={{display: "inline-block"}}>
					<div style={{display: "inline-block", width: 60, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(disk.value)}</div>
					<div style={{display: "inline-block", width: 60}}>&nbsp;{disk.disk}</div>
						</div>;
				})
			}

		</div>;
	}
}

