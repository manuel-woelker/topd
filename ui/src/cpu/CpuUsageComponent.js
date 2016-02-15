import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (!input || !input.toFixed) {
		return input;
	}
	return input.toFixed(2);
}

export default React.createClass({
	render() {
		let cpu_usage = this.props.cpu_usage || {};
		return <div>
			<h2>CPU Usage</h2>
			<Table striped bordered condensed hover style={{width: 200}}>
				<tbody>
				<tr>
					<td>User:</td>
					<td>{toFixed(cpu_usage.user*100)} %</td>
				</tr>
				<tr>
					<td>System:</td>
					<td>{toFixed(cpu_usage.system*100)} %</td>
				</tr>
				<tr>
					<td>Other:</td>
					<td>{toFixed(cpu_usage.other*100)} %</td>
				</tr>
				</tbody>
			</Table>
		</div>
	}
});
