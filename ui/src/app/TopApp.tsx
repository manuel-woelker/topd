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
declare const require: any;

var humanizeDuration = require('humanize-duration')

class UptimeComponent extends React.Component<{bootDate: number}> {
	render() {
		let uptime = Date.now() - this.props.bootDate;
		return <span title={humanizeDuration(uptime)}>up: {humanizeDuration(uptime, { largest: 2 })}</span>;
	}
}

function toFixed(input?: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(0);
}

function renderMem(memory: number) {
	return toFixed(memory / 1024 / 1024) + " GB";
}

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
		/*
		<Navbar fluid style={{marginBottom: 0, minHeight: 40, height: 40}}>
				<NavbarBrand><a  style={{padding: "4px"}} href="#"><b>{this.props.systemInfo.hostname}</b><span
					style={{display: "inline-block", width: 40}}/>topd <span className="pull-right"
					className="pull-right text-muted">{this.props.systemInfo.version} </span></a></NavbarBrand>
			</Navbar>

		 */

		let systemInfo = this.props.systemInfo;
		return <div>
			<div style={{padding: "8px", fontSize: "120%", height: "50px", display: "flex", flexWrap: "wrap", flex: "1 0 100px", justifyContent: "space-between"}}>
				<span><b>{systemInfo.hostname}</b>&nbsp;
				{systemInfo.os_release}</span>
				<UptimeComponent bootDate={systemInfo.bootDate} />
				<span>{renderMem(systemInfo.memory)} Mem | {renderMem(systemInfo.swap)} Swap</span>
				<span>{systemInfo.numberOfCpus} CPUs@{systemInfo.cpuSpeedInMhz} Mhz</span>
				{(systemInfo.ips && systemInfo.ips.length > 0)? <span title={systemInfo.ips.join(" ")}>IP: {systemInfo.ips[0]}</span>:null}
				<span><a style={{color: "#888"}} href="https://github.com/manuel-woelker/topd">topd {systemInfo.version}</a></span>
			</div>

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
