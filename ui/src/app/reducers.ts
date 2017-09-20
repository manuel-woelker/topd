const HISTORY_SIZE = 30;

export type DataSeries = number[];

export interface DiskHistory {
	_max: number,
	disks: { [key: string]: any },
}

export interface CpuUsage {
	system: number,
	user: number,
	other: number,
}

export interface DiskUsage {
	[key: string]: number;
}

export interface LoadAvg {
	load_avg_1_min?: number;
	load_avg_5_min?: number;
	load_avg_10_min?: number;
	color?: string;
}

export interface MemoryUsage {
	used: number;
	buffers: number;
	cache: number;
	swap: number;
}

export interface NetUsage {
	send: number;
	recv: number;
}

export interface Process {
	cpu: number;
	pid: number;
	cmd: string;
	cmdline: string;
	rss: number;
}

export interface State {
	systemMetrics: {
		loadavg?: LoadAvg;
		cpu_usage: CpuUsage;
		net_usage: NetUsage;
		disk_usage?: DiskUsage;
		memory_usage: MemoryUsage;
		processes?: Process[];
	},
	loadHistory: DataSeries;
	cpuHistory: {
		[P in keyof CpuUsage]: DataSeries;
	};
	memoryHistory: {
		[P in keyof MemoryUsage]: DataSeries;
	};
	netHistory: {
		send: DataSeries;
		recv: DataSeries;
		max: number;
	};
	diskHistory: DiskHistory;
	systemInfo: any;
	cmdlines: any;

}

let initialState: State = {
	systemMetrics: {
		loadavg: {},
		cpu_usage: {
			system: NaN,
			user: NaN,
			other: NaN,
		},
		memory_usage: {
			buffers: NaN,
			cache: NaN,
			swap: NaN,
			used: NaN,
		},
		net_usage: {
			send: NaN,
			recv: NaN,
		},

	},
	loadHistory: new Array(30),
	cpuHistory: {
		system: new Array(30),
		user: new Array(30),
		other: new Array(30)
	},
	memoryHistory: {
		used: new Array(HISTORY_SIZE),
		buffers: new Array(HISTORY_SIZE),
		cache: new Array(HISTORY_SIZE),
		swap: new Array(HISTORY_SIZE)
	},
	netHistory: {
		send: new Array(HISTORY_SIZE),
		recv: new Array(HISTORY_SIZE),
		max: 10
	},
	diskHistory: {
		_max: 10,
		disks: {}
	},
	systemInfo: {},
	cmdlines: {}
};

initialState.loadHistory.fill(0);
initialState.cpuHistory.user.fill(0);
initialState.cpuHistory.system.fill(0);
initialState.cpuHistory.other.fill(0);
initialState.memoryHistory.used.fill(0);
initialState.memoryHistory.buffers.fill(0);
initialState.memoryHistory.cache.fill(0);
initialState.memoryHistory.swap.fill(0);

initialState.netHistory.send.fill(0);
initialState.netHistory.recv.fill(0);


function receiveSystemMetrics(state: State, action: any) {
	var cpuUsage = action.systemMetrics.cpu_usage;
	var memoryUsage = action.systemMetrics.memory_usage;
	cpuUsage.other = Math.max(0, 1 - cpuUsage.system - cpuUsage.user - cpuUsage.idle);
	let cpuHistory = {
		user: state.cpuHistory.user.concat([cpuUsage.user]).slice(-HISTORY_SIZE),
		system: state.cpuHistory.system.concat([cpuUsage.system]).slice(-HISTORY_SIZE),
		other: state.cpuHistory.other.concat([cpuUsage.other]).slice(-HISTORY_SIZE)
	};
	let memoryHistory = {
		used: state.memoryHistory.used.concat([memoryUsage.used]).slice(-HISTORY_SIZE),
		buffers: state.memoryHistory.buffers.concat([memoryUsage.buffers]).slice(-HISTORY_SIZE),
		cache: state.memoryHistory.cache.concat([memoryUsage.cache]).slice(-HISTORY_SIZE),
		swap: state.memoryHistory.swap.concat([memoryUsage.swap]).slice(-HISTORY_SIZE)
	};
	var netUsage = action.systemMetrics.net_usage;
	var netHistory = state.netHistory;
	if (netUsage) {
		let netMaxValue = Math.max(state.netHistory.max, Math.max(netUsage.send, netUsage.recv));
		netHistory = {
			send: state.netHistory.send.concat([netUsage.send]).slice(-HISTORY_SIZE),
			recv: state.netHistory.recv.concat([netUsage.recv]).slice(-HISTORY_SIZE),
			max: netMaxValue
		};
	}
	var diskUsage = action.systemMetrics.disk_usage || {};
	var oldDiskHistory = state.diskHistory;
	let netMaxValue = oldDiskHistory._max;
	for (var disk in diskUsage) {
		let value = diskUsage[disk];
		netMaxValue = Math.max(netMaxValue, value);
	}
	let diskHistory: DiskHistory = {
		_max: netMaxValue,
		disks: {}
	};
	for (var disk in diskUsage) {
		let value = diskUsage[disk];
		var history = oldDiskHistory.disks[disk];
		if (!history) {
			history = new Array(HISTORY_SIZE);
		}
		diskHistory.disks[disk] = history.concat([value]).slice(-HISTORY_SIZE);
	}
	let loadHistory = state.loadHistory.concat([Math.min(1, action.systemMetrics.loadavg.load_avg_1_min / 10)]).slice(-HISTORY_SIZE);
	action.systemMetrics.loadavg.color = action.systemMetrics.loadavg.load_avg_1_min < 10 ? "#0d551c" : "#a00000";
	if (!action.systemMetrics.processes) {
		action.systemMetrics.processes = state.systemMetrics.processes;
	}
	let processes = action.systemMetrics.processes;
	let cmdlines = state.cmdlines;
	for (var i in processes) {
		let process = processes[i];
		if (process.cmdline) {
			cmdlines[process.pid] = process.cmdline;
		} else {
			process.cmdline = cmdlines[process.pid] || "?";
		}
	}
	return Object.assign({}, state, {
		systemMetrics: action.systemMetrics,
		cmdlines,
		cpuHistory: cpuHistory,
		loadHistory,
		memoryHistory,
		netHistory,
		diskHistory
	});
}

function receiveSystemInfo(state: State, action: any) {
	let newState = Object.assign({}, state, {systemInfo: action.systemInfo});
	newState.systemInfo.bootDate = Date.now() - (newState.systemInfo.uptime * 1000);
	return newState;
}


function reducer(state: State = initialState, action: any = {}) {
	switch (action.type) {
		case "RECEIVE_SYSTEM_METRICS":
			return receiveSystemMetrics(state, action);
		case "RECEIVE_SYSTEM_INFO":
			return receiveSystemInfo(state, action);
		default:
			return state;
	}
}

export default reducer;
