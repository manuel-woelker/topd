import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export default React.createClass({
	render() {
		let cpu_usage = this.props.cpu_usage || {};
		return <div>
			<div style={{width: 200, fontSize: "32px", display: "inline-block"}}>CPU Usage</div>
					<div style={{display: "inline-block", width: 100, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(cpu_usage.user*100)} %</div>
					<div style={{display: "inline-block", width: 100}}>&nbsp;User</div>
					<div style={{display: "inline-block", width: 100, color: "#c02e1d", fontWeight: "bold", textAlign: "right"}}>{toFixed(cpu_usage.system*100)} %</div>
					<div style={{display: "inline-block", width: 100}}>&nbsp;System</div>
					<div style={{display: "inline-block", width: 100, color: "#76772a", fontWeight: "bold", textAlign: "right"}}>{toFixed(cpu_usage.other*100)} %</div>
					<div style={{display: "inline-block", width: 100}}>&nbsp;Other</div>
		</div>;
	}
});
