import React from "react";
import Router from "react-router";

import LoadAvgComponent from "./load/LoadAvgComponent.js";

require("bootstrap/dist/css/bootstrap.css");
require("./style/style.css");

function render(loadavg) {
	React.render(
		<div>
    <h1>topd</h1>
		<LoadAvgComponent loadavg={loadavg} />
		</div>,
    document.getElementById('application')
  );
}


window.onload = function() {
	render();
	setInterval(() => {
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function reqListener () {
			let responseJson = JSON.parse(this.responseText);
			render(responseJson);
		});
		oReq.open("GET", "api/loadavg", true);
		oReq.send();
	}, 1000)
};
