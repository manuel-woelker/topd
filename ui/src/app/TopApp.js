import { connect } from 'react-redux';

import {Navbar, Nav, NavbarBrand, NavItem, Grid, Row} from "react-bootstrap";

import LoadAvgComponent from "../load/LoadAvgComponent.js";
import CpuUsageComponent from "../cpu/CpuUsageComponent.js";
import HistoryComponent from "../history/HistoryComponent.js";


export default connect(state => state)(React.createClass({
	render() {
		var cpuMetrics = [
			{
				strokeStyle: "#0d3c55",
				values: this.props.cpuHistory.user
			},	{
				strokeStyle: "#c02e1d",
				values: this.props.cpuHistory.system
			},	{
				strokeStyle: "#76772a",
				values: this.props.cpuHistory.other
			}
		];
		var loadMetrics = [
			{
				strokeStyle: "#0d551c",
				values: this.props.loadHistory
			}
		];
		return <div>
			<Navbar fluid>
				<NavbarBrand><a href="#">topd <b>{this.props.systemInfo.hostname}</b></a></NavbarBrand>
			</Navbar>

			<div style={{padding: "20px", paddingTop: 0}}>
				<Grid fluid>
					<Row>
						<CpuUsageComponent cpu_usage={this.props.systemMetrics.cpu_usage}/>
						<HistoryComponent metrics={cpuMetrics}/>
						<LoadAvgComponent loadavg={this.props.systemMetrics.loadavg}/>
						<HistoryComponent metrics={loadMetrics}/>
					</Row>
				</Grid>
			</div>
		</div>;

	}
}));
