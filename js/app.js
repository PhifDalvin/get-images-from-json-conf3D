let input = document.getElementById("file-input");
input.onchange = (e) => {

    var reader = new FileReader();
    reader.onload = (e) => {
        let json = JSON.parse(e.target.result);
        getSrcAndSourceValues(json);
    };
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



/*
$json = file_get_contents("assets/objects_2.json");
$obj = json_decode($json, true);
$result = array();

getSrcAndSourceValues($obj, $result); 

for ($i = 0; $i < count($result); $i++) {
    var_dump($i);
    $base64 = explode(",", $result[$i], 2);
    $image = imagecreatefromstring(base64_decode($base64[1]));
    $file = 'image' . uniqid() . ".jpg";
    imagejpeg($image, $file);
    imagedestroy($image);
    unset($image);
}

function getSrcAndSourceValues($obj, &$result) {
    var_dump("caca");
    if (is_array($obj) || is_object($obj)) {
        foreach ($obj as $key => $value) {
            if ($key === "src" || $key === "source") {
                $result[] = $value;
            } else {
                getSrcAndSourceValues($value, $result);
            }
        }
    }
}
*/

