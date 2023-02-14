let input = document.getElementById("id-input");
let download = document.getElementById("download");

download.onclick = (e) => {
    let link = "https://3d.dalvintech.app/downloadFiles/" + input.value;
    
    fetch(link)
    .then((response) => response.json())
    .then((json) => {
        getSrcAndSourceValues(json);
    })
    .catch(() => {
        alert("L'ID que vous avez entrée est incorrecte ou n'existe pas.");
    })
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