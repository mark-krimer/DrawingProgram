// Defining HTML elements
const sizeSelect = document.getElementById("sizeSelect");
const sizeDisplay = document.getElementById("sizeDisplay");
sizeDisplay.value = sizeSelect.value;
const colourSelect = document.getElementById("colourSelect");
const eraseToggle = document.getElementById("eraseTool");
const eyedropper = document.getElementById("eyedropTool");

const canvasId = document.getElementById("canvas");
const canvasCTX = canvasId.getContext("2d");
const displayWidth = canvas.clientWidth;
const displayHeight = canvas.clientHeight;
canvas.width = displayWidth;
canvas.height = displayHeight;

// Initiating variables
let isDrawing = false;
let isErasing = false;
let isEyedropping = false;
let drawingArea = canvasId.getBoundingClientRect();
let x = 0;
let y = 0;

// Initiating functions
function draw(e) {
	if (isDrawing != true) {
		return;
	}

	canvasCTX.lineCap = "round";
	canvasCTX.lineJoin = "round";

	// Determining location of mouse/touch
	if (e.touches) {
		x = e.touches[0].pageX - drawingArea.left;
		y = e.touches[0].pageY - drawingArea.top;
	} else {
		x = e.pageX - drawingArea.left;
		y = e.pageY - drawingArea.top;
	}

	// Drawing line to to new coordinates
	if (isErasing == false) {
		canvasCTX.globalCompositeOperation = "source-over";
		canvasCTX.lineTo(x, y);
		canvasCTX.stroke();
	} else {
		canvasCTX.globalCompositeOperation = "destination-out";
		canvasCTX.lineTo(x, y);
		canvasCTX.stroke();
	}
}

function startDrawing(e) {
	isDrawing = true;

	canvasCTX.beginPath();
	canvasCTX.moveTo(e.pageX - drawingArea.left, e.pageY - drawingArea.top);
}

function stopDrawing() {
	isDrawing = false;
}

function changeColour(colour) {
	canvasCTX.strokeStyle = `${colour}`;
	console.log("changeColour: ", colour);
}

function changeStroke(stroke) {
	canvasCTX.lineWidth = `${stroke}`;
	console.log("changeStroke: ", stroke);
}

function toggleEraseTool() {
	isErasing = !isErasing;
	eraseToggle.classList.toggle("selected");
}

function eyedropTool() {
	eyedropper.classList.add("selected");
	canvasId.addEventListener("mousedown", pickColour);
	canvasId.removeEventListener("mousedown", startDrawing);
}

function saveCanvas() {
	// Confirmtion
	let name = prompt("Enter a name for your file: ");
	console.log(name, name === null);

	if (name !== null) {
		// Setting up download link
		const a = document.createElement("a");

		const myBlob = dataURLtoBlob(canvasId.toDataURL());
		const download = window.URL.createObjectURL(myBlob);

		// Downloading
		a.href = download;
		a.download = `${name}.png`;
		a.style.display = "none";
		document.body.append(a);
		a.click();

		// Removing unneccessary <a>
		a.remove();
		window.URL.revokeObjectURL(download);
	}
}

function dataURLtoBlob(dataurl) {
	const arr = dataurl.split(",");
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

function deleteCanvas(canvas) {
	if (confirm("Are you sure you would like to delete canvas? This action can not be undone.")) {
		canvasCTX.clearRect(0, 0, canvasId.width, canvasId.height);
	}
}

function pickColour(e) {
	const pos = findPos(this);
	const x = e.pageX - pos.x;
	const y = e.pageY - pos.y;
	const p = canvasCTX.getImageData(x, y, 1, 1).data;
	const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	changeColour(hex);
	colourSelect.value = hex;

	canvasId.removeEventListener("mousedown", pickColour);
	canvasId.addEventListener("mousedown", startDrawing);
	eyedropper.classList.remove("selected");
}

function findPos(obj) {
	var curleft = 0,
		curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while ((obj = obj.offsetParent));
		return { x: curleft, y: curtop };
	}
	return undefined;
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}

// Event listeners
window.onload = function () {
	// Setting default drawing stats
	canvasCTX.lineWidth = `${sizeSelect.value}`;
	canvasCTX.strokeStyle = `${colourSelect.value}`;

	// Connecting drawing related events
	// Mouse events
	canvasId.addEventListener("mousemove", draw);
	canvasId.addEventListener("mousedown", startDrawing);
	canvasId.addEventListener("mouseup", stopDrawing);
	canvasId.addEventListener("mouseout", stopDrawing);
	//Touchscreen events
	canvasId.addEventListener("touchmove", draw);
	canvasId.addEventListener("touchstart", startDrawing);
	canvasId.addEventListener("touchend", stopDrawing);
	canvasId.addEventListener("touchcancel", stopDrawing);
};

colourSelect.addEventListener("change", function () {
	changeColour(this.value, this);
});

sizeSelect.addEventListener("change", () => {
	changeStroke(sizeSelect.value, this);
});

sizeSelect.addEventListener("input", () => {
	sizeDisplay.value = sizeSelect.value;
});

sizeDisplay.addEventListener("input", () => {
	if (sizeDisplay.value > 100) {
		sizeDisplay.value = 100;
	}
	sizeSelect.value = sizeDisplay.value;
	changeStroke(sizeDisplay.value, this);
});
