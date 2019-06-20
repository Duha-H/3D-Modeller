/**
 * Scene models file generator
 */


/**
 * Generates a downloadable JSON file of scene models
 * @param {Scene} scene Scene object from which building models are retreived
 */
export function fileGenerator(scene) {
    var buildings = scene.buildings;
    var currBuilding = {};
    var data = [];
    var id = 0;

    buildings.forEach((building) => {
        currBuilding = {}; // clear current building attributes

        // store building attributes
        currBuilding.id = id;
        currBuilding.floorType = building.floorType;
        //currBuilding.height = building.height;
        currBuilding.scale = [building.scaleX, building.scaleY, building.scaleZ];
        currBuilding.position = [building.posX, building.posZ];
        currBuilding.color = building.color;

        // add building to array of building objects
        data.push(currBuilding);
        id++;
    });


    console.log(data); // debugging
    // create JSON file Blob
    var file = new Blob([JSON.stringify(data, null, '\t')], {type: 'application/json'});
    var url = window.URL.createObjectURL(file);
    // bind file download link
    var download = document.getElementById('download');
    download.href = url;

    //window.URL.revokeObjectURL(url);
}