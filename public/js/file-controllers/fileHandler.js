

export function readFile() {
    console.log("clicked");
    var input = document.getElementById('file-upload');
    console.log(input);
    var reader = new FileReader();
    var file = input.files[0];
    reader.readAsText(file);
    var result = "";
    reader.onload = () => {
        //console.log("length: " + input.files.length);
        //reader.readAsText(input.files[0]);
        //result = reader.readAsText(input.files[0]);
        console.log(reader.result);
        result = reader.result;
        out.innerText = result;
    }
    console.log("length1: " + input.files.length);
    var out = document.getElementById('output');
    out.innerText = result;
    //result = reader.readAsText(file);
    console.log(result);
}