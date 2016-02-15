import {Table, Button} from "react-bootstrap";

export default React.createClass({
	paintCanvas() {
		var canvas = ReactDOM.findDOMNode(this.refs.canvas);
		var ctx = canvas.getContext('2d');
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		var height = canvas.height;
		var width = canvas.width;
		ctx.clearRect(0, 0, width, height); // clear canvas
		let array = this.props.cpuHistory.user;
		let xScale = width / array.length;
		let yScale = width;
		ctx.lineWidth = 5 / Math.max(width, height);
		ctx.scale(width / 8, height);
		ctx.translate(0, 1);
		ctx.translate(-1, 0);
		ctx.scale(1, -1);

		ctx.strokeStyle = "#0d3c55";
		drawLine(this.props.cpuHistory.user);
		ctx.strokeStyle = "#c02e1d";
		drawLine(this.props.cpuHistory.system);
		ctx.strokeStyle = "#76772a";
		drawLine(this.props.cpuHistory.other);

		function drawLine(array) {
			ctx.beginPath();
			ctx.moveTo(0, 0);
			var lastx = -1;
			var lasty = 0;
			for (var i = 1; i < array.length; i++) {
//			ctx.lineTo(i, array[i]);
				ctx.bezierCurveTo(i - 0.5, lasty, i - 0.5, array[i], i, array[i]);
				lastx = i;
				lasty = array[i];
			}
			ctx.stroke();
		}
	},

	componentDidUpdate() {
		this.paintCanvas()
	},

	render() {
		let cpuHistory = this.props.cpuHistory || {};
		return <div>
			<h2>CPU History</h2>
			<canvas ref="canvas" style={{border: "1px solid grey"}} height="400" width="800"/>
		</div>
	}
});
