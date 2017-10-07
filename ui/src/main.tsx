declare const require: any;

import * as React from "react";
import * as ReactDOM from 'react-dom';

import { connectRoutes } from 'redux-first-router'
import {combineReducers, createStore, applyMiddleware, compose, AnyAction} from 'redux'
import createHistory from 'history/createBrowserHistory'
import * as queryString from 'query-string'


// Redux DevTools store enhancers
//import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
//import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import { Provider } from 'react-redux';
import { TopApp } from './app/TopApp';
import reducers, {State} from './app/reducers';


import 'react-virtualized/styles.css';

require("./style/style.css");

/*
const finalCreateStore = compose(
	// Provides support for DevTools:
//	devTools()
	// Lets you write ?debug_session=<name> in address bar to persist debug sessions
//	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
*/
const history = createHistory();

// THE WORK:
const routesMap = {
	HOME: '/',      // action <-> url path
	CHANGE_SORT: "/",
};
const { reducer, middleware, enhancer } = connectRoutes(history, routesMap, {
	querySerializer: queryString
}); // yes, 3 redux aspects


const middlewares = applyMiddleware(middleware);
// note the order: enhancer, then middlewares
function rootReducer(state: State, action: AnyAction): State {
	let newState = reducers(state, action);
	let oldLocationState = newState.location;
	let newLocationState = reducer(oldLocationState as any, action);
	if(oldLocationState !== newLocationState) {
		newState = {...newState, location: newLocationState};
	}
	return newState;
}

const store = createStore(rootReducer, compose(enhancer, middlewares) as any);

declare const module: any;

if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept('./app/reducers', () => {
		const nextRootReducer = require('./app/reducers');
		store.replaceReducer(nextRootReducer);
	});
}

let debugPanel: any = null;
/*
let debugPanel = <DebugPanel top right bottom>
	<DevTools store={store} monitor={LogMonitor}/>
</DebugPanel>;
*/

declare const EventSource: any;

window.onload = function () {
	ReactDOM.render(
		<div>
			<Provider store={store}>
				<TopApp />
			</Provider>
			{debugPanel}
		</div>,
		document.getElementById('application')
	);

	let getSystemInfo = () => {
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function reqListener() {
			let responseJson = JSON.parse(this.responseText);
			store.dispatch({type: "RECEIVE_SYSTEM_INFO", systemInfo: responseJson});
		});
		oReq.open("GET", "api/system-info", true);
		oReq.send();
	};
/*
	setInterval(getSystemMetrics, 1000);
	getSystemMetrics();*/

	getSystemInfo();

	var evtSource = new EventSource("/api/system-metrics-events");
	evtSource.addEventListener("metrics", function(e: any) {
		var metrics = JSON.parse(e.data);
		store.dispatch({type: "RECEIVE_SYSTEM_METRICS", systemMetrics: metrics});
	}, false);
};
