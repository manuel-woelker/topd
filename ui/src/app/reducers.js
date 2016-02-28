let initialState = {
	systemMetrics: {
		loadavg: {}
	},
	loadHistory: [],
	cpuHistory: {
		system: [],
		user: [],
		other: []
	},
	systemInfo: {

	}
};


function receiveSystemMetrics(state, action) {
	var cpuUsage = action.systemMetrics.cpu_usage;
	cpuUsage.other = 1 - cpuUsage.system - cpuUsage.user - cpuUsage.idle;
	let cpuHistory = {
		user: state.cpuHistory.user.concat([cpuUsage.user]).slice(-10),
		system: state.cpuHistory.system.concat([cpuUsage.system]).slice(-10),
		other: state.cpuHistory.other.concat([cpuUsage.other]).slice(-10)
	};
	let loadHistory = state.loadHistory.concat([action.systemMetrics.loadavg.load_avg_1_min/10]).slice(-10);
	return Object.assign({}, state, {systemMetrics: action.systemMetrics, cpuHistory: cpuHistory, loadHistory, loadHistory});
}

function receiveSystemInfo(state, action) {
	return Object.assign({}, state, {systemInfo: action.systemInfo});
}


function reducer(state = initialState, action = {}) {
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
