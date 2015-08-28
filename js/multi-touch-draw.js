function MultiTouchDraw(canvas) {
	
	this.canvas = canvas;
	canvas.width = window.innerWidth;
	canvas.height = window.innerWidth * 0.45;
	this.ratio = {};
	this.ratio.width = 1;
	this.ratio.height = 1;

	this.context = canvas.getContext("2d");
	this.context.lineCap = "round";
	this.context.lineWidth = canvas.width / 50;

	this.ballpoints = {};
	this.counter = 0;

	canvas.addEventListener("mousedown", (function (e) {
		console.log(this);
		this.onDrawStart(e);
		canvas.onmousemove = this.onDraw.bind(this);
	}).bind(this));

	canvas.addEventListener("mouseup", (function (e) {
		this.onDrawEnd(e);
		canvas.onmousemove = null;
	}).bind(this));

	canvas.addEventListener("touchstart", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDrawStart(e.changedTouches[i]);
		}
	}).bind(this));

	canvas.addEventListener("touchmove", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDraw(e.changedTouches[i]);
		}
	}).bind(this));

	canvas.addEventListener("touchend", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDrawEnd(e.changedTouches[i]);
		}
	}).bind(this));

	window.addEventListener("resize", _.debounce((function (e) {
		this.ratio.width = canvas.width / window.innerWidth;
		this.ratio.height = canvas.height / (window.innerWidth * 0.45);
	}).bind(this), 100));
}

MultiTouchDraw.randomPastel = function () {
	var r = Math.floor(Math.random() * 4 + 1) * 64,
		g = Math.floor(Math.random() * 4 + 1) * 64,
		b = Math.floor(Math.random() * 4 + 1) * 64;
	return "rgb(" + r + ", " + g + ", " + b + ")";
};

MultiTouchDraw.prototype = {
	onDrawStart: function (e) {
		var ballpoint = {
			x: (e.pageX - this.canvas.offsetLeft) * this.ratio.width,
			y: (e.pageY - this.canvas.offsetTop) * this.ratio.height,
			color: MultiTouchDraw.randomPastel()
		};
		this.ballpoints[e.identifier || ++this.counter] = ballpoint;
		console.log(this.ratio.width);
		this._drawLine(ballpoint.x - 1, ballpoint.y, ballpoint.x, ballpoint.y, ballpoint.color);
	},
	onDraw: function (e) {
		var ballpoint = this.ballpoints[e.identifier || this.counter],
			x = (e.pageX - this.canvas.offsetLeft) * this.ratio.width,
			y = (e.pageY - this.canvas.offsetTop) * this.ratio.height;
		this._drawLine(ballpoint.x, ballpoint.y, x, y, ballpoint.color);
		ballpoint.x = x;
		ballpoint.y = y;
	},

	onDrawEnd: function (e) {
		delete this.ballpoints[e.identifier || this.counter];
	},

	drawLine: function (x0, y0, x1, y1, color) {
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x0, y0);
		this.context.lineTo(x1, y1);
		this.context.stroke();

		socket.emit('draw',{
			x0: x0 / this.canvas.width,
			y0: y0 / this.canvas.height,
			x1: x1 / this.canvs.width,
			y1: y1 / this.canvas.height,
			color: color
		});
	},

	_drawLine : _.debounce(function (x0, y0, x1, y1, color) {
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x0, y0);
		this.context.lineTo(x1, y1);
		this.context.stroke();

		//since every user's screen is going to have a different size,
		//we'll emit the relative coordinates of the points
		socket.emit('draw',{
			x0: x0 / this.canvas.width,
			y0: y0 / this.canvas.height,
			x1: x1 / this.canvas.width,
			y1: y1 / this.canvas.height,
			color: color
		});
		console.log("test _drawLine")
	}, 12),

	drawLineResponse: function(data) {
		console.log(this);
		this.context.strokeStyle = data.color;
		this.context.beginPath();
		this.context.moveTo(data.x0 * this.canvas.width, data.y0 * this.canvas.height);
		this.context.lineTo(data.x1 * this.canvas.width, data.y1 * this.canvas.height);
		this.context.stroke();
	}

	
};