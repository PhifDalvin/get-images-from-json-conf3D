let input = document.getElementById("id-input");
let inputIcon = document.getElementById("input-icon");
let inputLengthRequired = 52;
let download = document.getElementById("download");
let previewRow = document.getElementById("preview-row");

input.oninput = () => {
    if (input.value.length == inputLengthRequired) {
        inputOk();
        clearPreview();
        
        let link = "https://3d.dalvintech.app/downloadFiles/" + input.value.match(/(?<=VCONF).*/);
        fetch(link)
        .then((response) => response.json())
        .then((json) => {
            getSrcAndSourceValues(json, previewImage);
        });
    } else if (input.value.length == 0) {
        inputClear();
        clearPreview();
        inputCheck = true;
    } else {
        inputError();
        clearPreview();
        inputCheck = true;
    }
}

download.onclick = (e) => {
    let link = "https://3d.dalvintech.app/downloadFiles/" + input.value.match(/(?<=VCONF).*/);

    if (input.value.length == inputLengthRequired) {
        fetch(link)
        .then((response) => response.json())
        .then((json) => {
            getSrcAndSourceValues(json, downloadImage);
        })
        .catch(() => {
            alert("L'ID que vous avez entrée est incorrecte ou n'existe pas.");
        })
    }
    
    inputCheck = true;
}

function getSrcAndSourceValues(obj, callback, processedValues = new Set()) {
    for (const key in obj) {
        if (key === 'src' || key === 'source') {
            const value = obj[key];
            if (!processedValues.has(value)) {
                processedValues.add(value);
                callback(value);
            }
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            getSrcAndSourceValues(obj[key], callback, processedValues);
        }
    }
}

function downloadImage(base64) {
    let link = document.createElement('a');
    link.href = base64;
    link.download = "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function previewImage(base64) {
    let previewImage = document.createElement("img");
    previewImage.src = base64;
    previewImage.className = "preview-image";
    previewRow.appendChild(previewImage);
}

function clearPreview() {
    let previewImages = document.querySelectorAll(".preview-image");
    previewImages.forEach(element => {
        element.remove();        
    });
}

function inputOk() {
    inputIcon.style.visibility = "visible";
    inputIcon.innerHTML = "check";
    inputIcon.style.color = "green";   
    input.style.outline = "1px solid green";
}

function inputError() {
    inputIcon.style.visibility = "visible";
    inputIcon.innerHTML = "close";
    inputIcon.style.color = "red";
    input.style.outline = "1px solid red";
}

function inputClear() {
    inputIcon.style.visibility = "hidden";
    input.style.outline = "1px solid black";
}

