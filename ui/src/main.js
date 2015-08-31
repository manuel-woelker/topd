require("babel/polyfill");


import React from "react";
import Router from "react-router";


import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TopApp from './app/TopApp';
import reducers from './app/reducers';


require("bootstrap/dist/css/bootstrap.css");
require("./style/style.css");

let store = createStore(reducers);

function render(loadavg) {
}


window.onload = function() {
	React.render(
		<Provider store={store}>
			{() => <TopApp />}
		</Provider>,
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
