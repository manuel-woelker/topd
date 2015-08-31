import React from "react";
import Router from "react-router";

require("bootstrap/dist/css/bootstrap.css");
require("./style/style.css");


window.onload = function() {
/*	Router.run(routes, Router.HashLocation, (Root) => {
		React.render(<Root/>, document.getElementById('application'));
	});
	*/
  React.render(
    <h1>Hello topd</h1>,
    document.getElementById('application')
  );

};
