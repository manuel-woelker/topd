import { connect } from 'react-redux';

import {Navbar, Nav, NavItem, Grid, Row} from "react-bootstrap";

import LoadAvgComponent from "../load/LoadAvgComponent.js";
import CpuUsageComponent from "../cpu/CpuUsageComponent.js";


export default connect(state => state)(React.createClass({
	render() {
		return <div>
			<Navbar fluid brand={<a href="#">topd <b>{this.props.systemInfo.hostname}</b></a>}>
				<Nav>
					<NavItem eventKey={1} href='#'>Refresh</NavItem>
				</Nav>
			</Navbar>

			<div style={{padding: "20px", paddingTop: 0}}>
				<Grid fluid>
					<Row>
						<LoadAvgComponent loadavg={this.props.systemMetrics.loadavg}/>
						<CpuUsageComponent cpu_usage={this.props.systemMetrics.cpu_usage}/>
					</Row>
				</Grid>
			</div>
		</div>;

	}
}));
