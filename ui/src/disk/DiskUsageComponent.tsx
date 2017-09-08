import * as React from "react";
import {DiskUsage} from "../app/reducers";
import {UsageComponent} from "../app/UsageComponent";

function toFixed(input: number) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(0);
}

export class DiskUsageComponent extends React.Component<{ diskUsage?: DiskUsage }> {
	render() {
		let diskUsage = this.props.diskUsage || {};
		let disks: { disk: string, value: number }[] = [];
		for (var disk in diskUsage) {
			disks.push({disk: disk, value: diskUsage[disk]});
		}
		return <UsageComponent title="Disk Usage">
			{
				disks.map((disk) => {
					return <div key={disk.disk}>
						<span style={{color: "#0d3c55", fontWeight: "bold"}}>{toFixed(disk.value)}</span>
						&nbsp;{disk.disk}
					</div>;
				})
			}

		</UsageComponent>;
	}
}

