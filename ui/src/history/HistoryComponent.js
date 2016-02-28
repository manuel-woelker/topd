import {Table, Button} from "react-bootstrap";

export default React.createClass({
	paintCanvas() {
		var canvas = ReactDOM.findDOMNode(this.refs.canvas);
		var ctx = canvas.getContext('2d');
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		var height = canvas.height;
		var width = canvas.width;
		ctx.clearRect(0, 0, width, height); // clear canvas
		var metrics = this.props.metrics;
        let array = metrics[0].values;
		let xScale = width / array.length;
		let yScale = width;
		ctx.lineWidth = 5 / Math.max(width, height);
		ctx.scale(width / 8, height);
		ctx.translate(0, 1);
		ctx.translate(-1, 0);
		ctx.scale(1, -1);

		for(var i = 0; i < metrics.length; i++) {
			var metric = metrics[i];
			ctx.strokeStyle = metric.strokeStyle;
			drawLine(metric.values);
		}

		function drawLine(array) {
			ctx.beginPath();
			ctx.moveTo(0, 0);
			var lastx = -1;
			var lasty = 0;
			for (var i = 1; i < array.length; i++) {
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
		return <div>
			<canvas ref="canvas" style={{border: "1px solid grey"}} height="400" width="800"/>
		</div>
	}
});
