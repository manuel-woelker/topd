let initialState = {
	systemMetrics: {
		loadavg: {}
	},
	loadHistory: new Array(30),
	cpuHistory: {
		system: new Array(30),
		user: new Array(30),
		other: new Array(30)
	},
	systemInfo: {

	}
};

initialState.loadHistory.fill(0);
initialState.cpuHistory.user.fill(0);
initialState.cpuHistory.system.fill(0);
initialState.cpuHistory.other.fill(0);

const HISTORY_SIZE = 30;

function receiveSystemMetrics(state, action) {
	var cpuUsage = action.systemMetrics.cpu_usage;
	cpuUsage.other = 1 - cpuUsage.system - cpuUsage.user - cpuUsage.idle;
	let cpuHistory = {
		user: state.cpuHistory.user.concat([cpuUsage.user]).slice(-HISTORY_SIZE),
		system: state.cpuHistory.system.concat([cpuUsage.system]).slice(-HISTORY_SIZE),
		other: state.cpuHistory.other.concat([cpuUsage.other]).slice(-HISTORY_SIZE)
	};
	let loadHistory = state.loadHistory.concat([action.systemMetrics.loadavg.load_avg_1_min/10]).slice(-HISTORY_SIZE);
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
