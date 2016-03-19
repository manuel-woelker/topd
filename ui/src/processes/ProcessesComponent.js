import {Table, Button} from "react-bootstrap";

function toFixed(input) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

export default React.createClass({
	render() {
		let processes = this.props.processes || [];
		processes = processes.slice();
		processes.sort((a, b) => b.cpu - a.cpu);
		return <div>
			<div style={{fontSize: "32px"}}>Processes</div>
			<div style={{ overflowY: "scroll"}}>
			<Table striped bordered condensed hover className="processes" style={{tableLayout: "fixed", marginBottom: 0}}>
				<thead>
				<tr>
					<th>PID</th>
					<th>Cmd</th>
					<th>CPU</th>
					<th>Memory</th>
				</tr>
				</thead>
			</Table>
			</div>
			<div style={{height: "calc(100vh - 200px)", overflowY: "scroll"}}>
				<Table striped bordered condensed hover className="processes" style={{tableLayout: "fixed"}}>
					<tbody>
					{processes.map((process) => {
						return <tr key={process.pid}>
							<td>{process.pid}</td>
							<td title={process.cmdline}>{process.cmd}{process.cmdline?" - ":""}{process.cmdline}</td>
							<td>{toFixed(process.cpu * 100)} %</td>
							<td>{toFixed(process.rss / 1024 / 1024)} MB</td>
						</tr>;
					})}
					</tbody>
				</Table>
			</div>
		</div>;
	}
});











