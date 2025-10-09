// Defining HTML elements
const sizeSelect = document.getElementById("sizeSelect");
const sizeDisplay = document.getElementById("sizeDisplay");
sizeDisplay.value = sizeSelect.value;
const colourSelect = document.getElementById("colourSelect");

const canvasId = document.getElementById("canvas");
const canvasCTX = canvasId.getContext("2d");
const displayWidth = canvas.clientWidth;
const displayHeight = canvas.clientHeight;
canvas.width = displayWidth;
canvas.height = displayHeight;

// Initiating variables
let isDrawing = false;
let drawingArea = canvasId.getBoundingClientRect();
let lastX = 0;
let lastY = 0;

// Initiating functions
function draw(e) {
	if (isDrawing == true) {
		// Determining location of mouse pointer
		lastX = e.pageX - drawingArea.left;
		lastY = e.pageY - drawingArea.top;

		// Drawing line to to new coordinates
		canvasCTX.lineTo(lastX, lastY);
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

function changeColour(colour, element) {
	canvasCTX.strokeStyle = `${colour}`;
	console.log("changeColour: ", colour);
}

function changeStroke(stroke, element) {
	canvasCTX.lineWidth = `${stroke}`;
	console.log("changeStroke: ", stroke);
}

function saveCanvas(canvas) {
	// Setting up download link
	const a = document.createElement("a");

	const myBlob = dataURLtoBlob(canvasId.toDataURL());
	const download = window.URL.createObjectURL(myBlob);

	// Downloading
	a.href = download;
	a.download = `${prompt("Please name your file: ")}.png`;
	a.style.display = "none";
	document.body.append(a);
	a.click();

	// Removing unneccessary <a>
	a.remove();
	window.URL.revokeObjectURL(download);
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

// Event listeners
window.onload = function () {
	// Setting default drawing stats
	canvasCTX.lineWidth = `${sizeSelect.value}`;
	canvasCTX.strokeStyle = `${colourSelect.value}`;

	// Connecting drawing related events
	canvasId.addEventListener("mousemove", draw);
	canvasId.addEventListener("mousedown", startDrawing);
	canvasId.addEventListener("mouseup", stopDrawing);
	canvasId.addEventListener("mouseout", stopDrawing);
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
