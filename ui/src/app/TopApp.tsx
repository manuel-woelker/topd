import {connect} from 'react-redux';

import {Navbar, Nav, NavbarBrand, NavItem, Grid, Row, Col} from "react-bootstrap";
import * as SplitPane from "react-split-pane";

import {LoadAvgComponent} from "../load/LoadAvgComponent";
import {CpuUsageComponent} from "../cpu/CpuUsageComponent";
import {MemoryUsageComponent} from "../memory/MemoryUsageComponent";
import {NetUsageComponent} from "../net/NetUsageComponent";
import {DiskUsageComponent} from "../disk/DiskUsageComponent";

import {HistoryComponent} from "../history/HistoryComponent";

import {ProcessesComponent} from "../processes/ProcessesComponent";
import {State} from "./reducers";
import * as React from "react";

class TopAppUnconnected extends React.Component<State> {
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
				strokeStyle: "#c02e1d",
				values: values.map((x: number) => x / diskMaxValue)
			})
		}


		let loadavg = this.props.systemMetrics.loadavg || {color: "red"};
		var loadMetrics = [
			{
				strokeStyle: loadavg.color,
				values: this.props.loadHistory
			}
		];

		return <div>
			<Navbar fluid style={{marginBottom: 0, minHeight: 40, height: 40}}>
				<NavbarBrand><a  style={{padding: "4px"}} href="#"><b>{this.props.systemInfo.hostname}</b><span
					style={{display: "inline-block", width: 40}}/>topd <span
					className="text-muted">{this.props.systemInfo.version} </span></a></NavbarBrand>
			</Navbar>

			<div style={{padding: "20px", paddingTop: 0, position: "relative", height: "calc(100vh - 75px)"}}>
				<SplitPane split="vertical" defaultSize="50%">
					<div className="pane" style={{height: "100%", display: "flex", flexDirection: "column"}}>
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
					</div>
					<div className="pane" style={{height: "100%"}}>
						<ProcessesComponent processes={this.props.systemMetrics.processes}/>
					</div>
				</SplitPane>
			</div>
		</div>;

	}
}


export const TopApp = connect((state: State) => state)(TopAppUnconnected);
