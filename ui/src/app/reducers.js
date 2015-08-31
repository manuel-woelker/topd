let initialState = {
	systemMetrics: {
		loadavg: {}
	}
};


function receiveSystemMetrics(state, action) {
	return Object.assign({}, state, {systemMetrics: action.systemMetrics});
}

function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case "RECEIVE_SYSTEM_METRICS":
			return receiveSystemMetrics(state, action);
		default:
			return state;
	}
}

export default reducer;
