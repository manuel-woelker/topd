import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(0);
}

export default React.createClass({
	render() {
		let diskUsage = this.props.diskUsage || {};
		let disks = [];
		for(var disk in diskUsage) {
			disks.push({disk: disk, value: diskUsage[disk]});
		}
		return <div>
			<div style={{width: 200, fontSize: "32px", display: "inline-block"}}>Disk Usage</div>
			{
				disks.map((disk) => {
					return <div key={disk} style={{display: "inline-block"}}>
					<div style={{display: "inline-block", width: 100, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(disk.value)}</div>
					<div style={{display: "inline-block", width: 100}}>&nbsp;{disk.disk}</div>
						</div>;
				})
			}

		</div>;
	}
});

