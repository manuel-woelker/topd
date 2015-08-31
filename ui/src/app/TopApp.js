import { connect } from 'react-redux';

import {Navbar, Nav, NavItem, Grid, Row} from "react-bootstrap";

import LoadAvgComponent from "../load/LoadAvgComponent.js";


export default connect(state => state)(React.createClass({
	render() {
		return <div>
			<Navbar brand={<a href="#">topd</a>}>
				<Nav>
					<NavItem eventKey={1} href='#'>Refresh</NavItem>
				</Nav>
			</Navbar>

			<div style={{padding: "20px", paddingTop: 0}}>
				<Grid fluid>
					<Row>
						<LoadAvgComponent loadavg={this.props.systemMetrics.loadavg}/>
					</Row>
				</Grid>
			</div>
		</div>;

	}
}));
