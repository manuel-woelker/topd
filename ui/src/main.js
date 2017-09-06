//require("babel/polyfill");

require("expose-loader?React!react");


// Redux utility functions
import { compose, createStore, applyMiddleware } from 'redux';
// Redux DevTools store enhancers
//import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
//import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import { Provider } from 'react-redux';
import TopApp from './app/TopApp';
import reducers from './app/reducers';


require("bootstrap/dist/css/bootstrap.css");
require("./style/style.css");

/*
const finalCreateStore = compose(
	// Provides support for DevTools:
//	devTools()
	// Lets you write ?debug_session=<name> in address bar to persist debug sessions
//	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
*/

let finalCreateStore = createStore;

let store = finalCreateStore(reducers);


if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept('./app/reducers', () => {
		const nextRootReducer = require('./app/reducers');
		store.replaceReducer(nextRootReducer);
	});
}

let debugPanel = null;
/*
let debugPanel = <DebugPanel top right bottom>
	<DevTools store={store} monitor={LogMonitor}/>
</DebugPanel>;
*/

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
	evtSource.addEventListener("metrics", function(e) {
		var metrics = JSON.parse(e.data);
		store.dispatch({type: "RECEIVE_SYSTEM_METRICS", systemMetrics: metrics});
	}, false);
};
