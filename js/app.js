let input = document.getElementById("id-input");
let inputIcon = document.getElementById("input-icon");
let inputLengthRequired = 52;
let download = document.getElementById("download");
let openPdf = document.getElementById("open");
let previewRow = document.getElementById("preview-row");

input.oninput = () => {
    if (input.value.length == inputLengthRequired) {
        inputOk();
        clearPreview();
        let loader = new Loader()
        loader.create();
        
        let link = "https://3d.dalvintech.app/downloadFiles/" + input.value.match(/(?<=VCONF).*/);
        fetch(link)
        .then((response) => response.json())
        .then((json) => {
            loader.remove();
            getSrcAndSourceValues(json, previewImage);
            let textProperties = getTextProperties(json);
            previewText(textProperties);
        })
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
    } else {
        alert("Veuillez entrer un ID de commande Configurateur 3D valide.")
    }
    
    inputCheck = true;
}

openPdf.onclick = () => {
    let linkPdf = "https://3d.dalvintech.app/downloadPrintFile/" + input.value.match(/(?<=VCONF).*/);
    if (input.value.length == inputLengthRequired) {
        openPdf.href = linkPdf;
    } else {
        openPdf.href = "javascript:"
        alert("Veuillez entrer un ID de commande Configurateur 3D valide.")
    }
    
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

function getTextProperties(obj) {
    const textPropertiesArray = [];
    
    function findProperties(obj) {
        const textProperties = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                findProperties(obj[key]);
            } else {
                if (key === 'fontFamily' || key === 'fontStyle' || key === 'fontWeight' || key === 'text') {
                    textProperties[key] = obj[key];
                }
            }
        }
        if (Object.keys(textProperties).length > 0) {
            const hasUniqueProperty = textPropertiesArray.every((props) => {
                return !Object.keys(textProperties).every((key) => props.hasOwnProperty(key) && props[key] === textProperties[key]);
            });
            if (hasUniqueProperty) {
                textPropertiesArray.push(textProperties);
            }
        }
    }
    
    findProperties(obj);
    return textPropertiesArray;
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

function previewText(texts) {
    for (let i = 0; i < texts.length; i++) {
        let textProperties = 
        `<b>Texte :</b> 
        <br/>
        ${texts[i].text}
        <br/><br/>
        <b>Font :</b> 
        <br/>
        ${texts[i].fontFamily}
        <br/><br/>
        <b>Épaisseur :</b> 
        <br/>
        ${texts[i].fontWeight}
        <br/><br/>
        <b>Style :</b> 
        <br/>
        ${texts[i].fontStyle}`;
        let previewText = document.createElement("div");
        previewText.className = "preview-image";
        previewText.innerHTML = textProperties;
        previewRow.appendChild(previewText);
    }
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

class Loader {
    create() {
        let loader = document.createElement("div");
        loader.className = "lds-dual-ring";
        previewRow.appendChild(loader);
    }
    remove() {
        let loader = document.getElementsByClassName("lds-dual-ring");
        for (let i = 0; i < loader.length; i++) {
            loader[i].remove();
        };
    }
}
