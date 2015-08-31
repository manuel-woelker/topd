

let initialState = {
    loadavg: {
    }
};


function applyLoadAvg(state, action) {
    return Object.assign({}, state, {loadavg: action.loadavg});
}

function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case "APPLY_LOADAVG":
            return applyLoadAvg(state, action);
        default:
            return state;
    }
}

export default reducer;