import * as React from "react";
import * as ReactDOM from "react-dom";

import {
	AutoSizer
} from 'react-virtualized'
import {DataSeries} from "../app/reducers";

const NUMBER_OF_VALUES = 30;

export interface Metrics {
	strokeStyle?: string;
	values: DataSeries;
}

export class HistoryComponent extends React.Component<{ metrics?: Metrics[] }> {
	painted: boolean = false;
	canvas: HTMLCanvasElement;
	scale: number;
	lastUpdateTime: number;

	constructor(props: any, context: any) {
		super(props, context);
		this.scroll = this.scroll.bind(this);
	}

	paintCanvas() {
		var canvas = this.canvas;
		if(!canvas) {
			return true;
		}
		this.painted = true;
		var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		var height = canvas.height;
		var width = canvas.width;
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, width, height); // clear canvas
		var metrics = this.props.metrics;
		if (!metrics || !metrics.length) {
			return;
		}
		let array = metrics[0].values;
		let xScale = width / array.length;
		let yScale = width;
		ctx.lineWidth = 10 / Math.max(width, height);
		this.scale = width / (metrics[0].values.length-2);
		ctx.translate(0, 0);
		ctx.scale(this.scale, height);
		ctx.translate(0, 1);
		ctx.translate(-1, 0);
		ctx.scale(1, -0.98);
		ctx.lineWidth = 2;

		for (var i = 0; i < metrics.length; i++) {
			var metric = metrics[i];
			ctx.strokeStyle = metric.strokeStyle || "red";
			drawLine(metric.values);
		}

		function drawLine(array: number[]) {
			ctx.beginPath();
			ctx.moveTo(0, 0);
			var lastx = -1;
			var lasty = 0;
			for (var i = 1; i < array.length; i++) {
				ctx.bezierCurveTo(i - 0.5, lasty, i - 0.5, array[i], i, array[i]);
				lastx = i;
				lasty = array[i];
			}
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.stroke();
			ctx.restore();
		}
	}

	componentDidUpdate() {
		this.paintCanvas()
	}

	scroll(totalTimeMs: number) {
		if (this.painted) {
			this.painted = false;
			this.lastUpdateTime = totalTimeMs;
		}
		var elapsedTime = totalTimeMs - this.lastUpdateTime;
		var pixelMove = -elapsedTime * this.scale / 500;
		this.canvas.style.left = pixelMove + "px";
		this.canvas.style.position = "relative";
		window.requestAnimationFrame(this.scroll);
	}

	componentDidMount() {
		this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
		window.requestAnimationFrame(this.scroll);
	}


	render() {
		return <div style={{overflow: "hidden", flexGrow: 1, paddingBottom: "10px"}}>
			<AutoSizer>
				{({height, width}) =>
					<div>
						<canvas ref={(canvas: HTMLCanvasElement) => { this.canvas = canvas; }} height={height} width={width*(NUMBER_OF_VALUES+1.5)/NUMBER_OF_VALUES}/>
					</div>
				}
			</AutoSizer>
		</div>
	}
}
