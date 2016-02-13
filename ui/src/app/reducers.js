let initialState = {
	systemMetrics: {
		loadavg: {}
	},
	systemInfo: {

	}
};


function receiveSystemMetrics(state, action) {
	return Object.assign({}, state, {systemMetrics: action.systemMetrics});
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
