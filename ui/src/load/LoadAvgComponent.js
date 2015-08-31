import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(2);
}

export default React.createClass({
	render() {
		let loadavg = this.props.loadavg || {};
		return <div>
			<h2>Load average</h2>
			<Table striped bordered condensed hover style={{width: 200}}>
				<tbody>
				<tr>
					<td>1 minute:</td>
					<td>{toFixed(loadavg.load_avg_1_min)}</td>
				</tr>
				<tr>
					<td>5 minutes:</td>
					<td>{toFixed(loadavg.load_avg_5_min)}</td>
				</tr>
				<tr>
					<td>10 minutes:</td>
					<td>{toFixed(loadavg.load_avg_10_min)}</td>
				</tr>
				</tbody>
			</Table>
		</div>
	}
});
