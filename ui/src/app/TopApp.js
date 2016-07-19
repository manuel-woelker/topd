import { connect } from 'react-redux';

import {Navbar, Nav, NavbarBrand, NavItem, Grid, Row, Col} from "react-bootstrap";

import LoadAvgComponent from "../load/LoadAvgComponent.js";
import CpuUsageComponent from "../cpu/CpuUsageComponent.js";
import MemoryUsageComponent from "../memory/MemoryUsageComponent.js";
import NetUsageComponent from "../net/NetUsageComponent.js";
import DiskUsageComponent from "../disk/DiskUsageComponent.js";

import HistoryComponent from "../history/HistoryComponent.js";

import ProcessesComponent from "../processes/ProcessesComponent.js";

export default connect(state => state)(React.createClass({
	render() {
		var cpuMetrics = [
			{
				strokeStyle: "#0d3c55",
				values: this.props.cpuHistory.user
			}, {
				strokeStyle: "#c02e1d",
				values: this.props.cpuHistory.system
			}, {
				strokeStyle: "#76772a",
				values: this.props.cpuHistory.other
			}
		];
		var memoryMetrics = [
			{
				strokeStyle: "#0d551c",
				values: this.props.memoryHistory.used
			}, {
				strokeStyle: "#0d3c55",
				values: this.props.memoryHistory.buffers
			}, {
				strokeStyle: "#76772a",
				values: this.props.memoryHistory.cache
			}, {
				strokeStyle: "#c02e1d",
				values: this.props.memoryHistory.swap
			}
		];
		var netMaxValue = this.props.netHistory.max;
		var netMetrics = [
			{
				strokeStyle: "#0d3c55",
				values: this.props.netHistory.recv.map((x) => x / netMaxValue)
			}, {
				strokeStyle: "#c02e1d",
				values: this.props.netHistory.send.map((x) => x / netMaxValue)
			}
		];

		var diskHistory = this.props.diskHistory;
		var diskMaxValue = diskHistory._max;
		var diskMetrics = [];
		for (var disk in diskHistory.disks) {
			let values = diskHistory.disks[disk];
			diskMetrics.push({
				disk: disk,
				strokeStyle: "#c02e1d",
				values: values.map((x) => x / diskMaxValue)
			})
		}


		var loadMetrics = [
			{
				strokeStyle: this.props.systemMetrics.loadavg.color,
				values: this.props.loadHistory
			}
		];
		return <div>
			<Navbar fluid>
				<NavbarBrand><a href="#"><b>{this.props.systemInfo.hostname}</b><span style={{display: "inline-block", width: 40}}/>topd <span className="text-muted">{this.props.systemInfo.version} </span></a></NavbarBrand>
			</Navbar>

			<div style={{padding: "20px", paddingTop: 0}}>
				<Grid fluid>
					<Row>
						<Col lg={6}>
							<CpuUsageComponent cpu_usage={this.props.systemMetrics.cpu_usage}/>
							<HistoryComponent metrics={cpuMetrics}/>
							<LoadAvgComponent loadavg={this.props.systemMetrics.loadavg}/>
							<HistoryComponent metrics={loadMetrics}/>
							<MemoryUsageComponent memoryUsage={this.props.systemMetrics.memory_usage}/>
							<HistoryComponent metrics={memoryMetrics}/>
							<NetUsageComponent netUsage={this.props.systemMetrics.net_usage}/>
							<HistoryComponent metrics={netMetrics}/>
							<DiskUsageComponent diskUsage={this.props.systemMetrics.disk_usage}/>
							<HistoryComponent metrics={diskMetrics}/>
						</Col>
						<Col lg={6} style={{height: "90vh"}}>
							<ProcessesComponent processes={this.props.systemMetrics.processes}/>
						</Col>
					</Row>
				</Grid>
			</div>
		</div>;

	}
}));
