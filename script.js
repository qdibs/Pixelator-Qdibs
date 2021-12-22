// By Qdibs

//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input"),
  downloadBtn = document.getElementById("download-btn"),
  pixelateInput = document.getElementById("pixelate-amount");
let file;

//if user click on the button then the input also clicked
button.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile();
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile();
});

function showFile() {
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];

  //if user selected file is an image file
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      createCanvas(fileReader.result); //passing user file source to createCanvas
    };
    fileReader.readAsDataURL(file);
    downloadBtn.classList.remove("disabled");
  } else {
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

function createCanvas(imgURL) {
  const canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.width = 700;
  canvas.height = 500;

  dropArea.innerHTML = "";
  dropArea.appendChild(canvas);

  var ctx = canvas.getContext("2d"),
    img = new Image();

  // turn off image smoothing - this will give the pixelated effect
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  img.src = imgURL;
  img.onload = pixelate;

  function pixelate() {
    var size = (100 - pixelateInput.value + 1) * 0.01,
      w = canvas.width * size,
      h = canvas.height * size;

    // draw original image to the scaled size
    ctx.drawImage(img, 0, 0, w, h);

    // then draw that scaled image thumb back to fill canvas
    // As smoothing is off the result will be pixelated
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  }

  pixelateInput.addEventListener("change", pixelate, false);
}

downloadBtn.addEventListener("click", () => {
  var link = document.createElement("a");
  link.download = "pixelated.png";
  link.href = document.getElementById("canvas").toDataURL("image/png");
  link.click();
});