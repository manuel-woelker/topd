import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(3);
}

export default React.createClass({
	render() {
		let netUsage = this.props.netUsage || {};
		return <div>
			<div style={{width: 200, fontSize: "32px", display: "inline-block"}}>Network</div>
					<div style={{display: "inline-block", width: 150, color: "#0d3c55", fontWeight: "bold", textAlign: "right"}}>{toFixed(netUsage.recv/1024/1024)} MB/s</div>
					<div style={{display: "inline-block", width: 150}}>&nbsp;Receive</div>
					<div style={{display: "inline-block", width: 150, color: "#c02e1d", fontWeight: "bold", textAlign: "right"}}>{toFixed(netUsage.send/1024/1024)} MB/s</div>
					<div style={{display: "inline-block", width: 150}}>&nbsp;Send</div>
		</div>;
	}
});



