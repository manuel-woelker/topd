import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export default React.createClass({
	render() {
		let memoryUsage = this.props.memoryUsage || {};
		return <div>
			<div style={{width: 200, fontSize: "32px", display: "inline-block"}}>Memory</div>
			<div
				style={{display: "inline-block", width: 75, color: "#0d551c", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.used * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: 75}}>&nbsp;Used</div>
			<div
				style={{display: "inline-block", width: 75, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.buffers * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: 75}}>&nbsp;Buffers</div>
			<div
				style={{display: "inline-block", width: 75, color: "#76772a", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.cache * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: 75}}>&nbsp;Cache</div>
			<div
				style={{display: "inline-block", width: 75, color: "#c02e1d", fontWeight: "bold", textAlign: "right"}}>{toFixed(memoryUsage.swap * 100)}
				%
			</div>
			<div style={{display: "inline-block", width: 75}}>&nbsp;Swap</div>
		</div>;
	}
});
