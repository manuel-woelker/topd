require("babel/polyfill");

require("expose?React!react");

import Router from "react-router";


// Redux utility functions
import { compose, createStore, applyMiddleware } from 'redux';
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import { Provider } from 'react-redux';
import TopApp from './app/TopApp';
import reducers from './app/reducers';


require("bootstrap/dist/css/bootstrap.css");
require("./style/style.css");

const finalCreateStore = compose(
	// Provides support for DevTools:
	devTools(),
	// Lets you write ?debug_session=<name> in address bar to persist debug sessions
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
	createStore
);

let store = finalCreateStore(reducers);

function render(loadavg) {
}


window.onload = function() {
	React.render(
		<div>
		<Provider store={store}>
			{() => <TopApp />}
		</Provider>
			<DebugPanel top right bottom>
				<DevTools store={store} monitor={LogMonitor} />
			</DebugPanel>
			</div>,
		document.getElementById('application')
	);
	setInterval(() => {
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function reqListener () {
			let responseJson = JSON.parse(this.responseText);
			store.dispatch({type: "APPLY_LOADAVG", loadavg: responseJson});
		});
		oReq.open("GET", "api/loadavg", true);
		oReq.send();
	}, 1000);

	store.dispatch({type: "GET_LOADAVG"});
/*	render();
	setInterval(() => {
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function reqListener () {
			let responseJson = JSON.parse(this.responseText);
			render(responseJson);
		});
		oReq.open("GET", "api/loadavg", true);
		oReq.send();
	}, 1000)
	*/
};
