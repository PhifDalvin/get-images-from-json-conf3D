let input = document.getElementById("file-input");

input.onchange = (e) => {
    let reader = new FileReader();
    reader.onload = (e) => {
        let json = JSON.parse(e.target.result);
        getSrcAndSourceValues(json);
    }
    reader.readAsText(e.target.files[0]);
}

function getSrcAndSourceValues(obj) {
    for (const key in obj) {
        if (key === 'src' || key === 'source') {
            const value = obj[key];
            downloadImage(value);
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            getSrcAndSourceValues(obj[key]);
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