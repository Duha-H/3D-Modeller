import { fileReader, drawBuildings } from '../file-controllers/fileReader.js';
import { fileGenerator } from '../file-controllers/fileGenerator.js';

/**
 * Event handling module for general document-related events
 */

var tabButtons;
var linkedScene;
var linkedCustomizer;


/**
 * Assigns/binds all event listeners for general document elements
 */
export function PageEventHandler(scene, profileCustomizer) {

    linkedScene = scene;
    linkedCustomizer = profileCustomizer;
    // Bind theme toggle handler
    document.querySelector('input').addEventListener('change', toggleTheme, false);

    // Bind side-bar tab button handlers
    tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length !== 0)
        handleTabButtons();

    // Bind file upload button handler
    var uploadButton = document.getElementById('upload');
    uploadButton.addEventListener('click', () => { fileReader(scene.gl) }, false);

    // Bind load buildings button handler
    var uploadButton = document.getElementById('load-buildings');
    uploadButton.addEventListener('click', () => { drawBuildings(scene) }, false);
    
    // Bind file download button handler
    var downloadButton = document.getElementById('download');
    downloadButton.addEventListener('click', () => { fileGenerator(scene) }, false);

    // File upload trigger and label update
    var inputForm = document.getElementById('file-upload');
    var uploadLabel = document.getElementById('upload-label');

    uploadLabel.addEventListener('click', () => { inputForm.click(); }, false);
    inputForm.onchange = () => {
        var file = inputForm.files[0];
        uploadLabel.innerHTML = file.name;

    };
    
}


/**
 * Binds event listeners to side-bar tab buttons
 */
function handleTabButtons() {
    tabButtons.forEach((element) => {
        element.addEventListener('click', onTabButtonClick, false);
    });
}


/**
 * Handles click event for toggling between side-bar tabs
 * @param {Event} e Click event
 */
function onTabButtonClick(e) {
    var button = e.target;
    if(button.tagName !== 'INPUT') // check that a tab 'button' was actually clicked
        return;
    // deactivate active button
    tabButtons.forEach((element) => {
        if(element.className.includes('active') && element !== button) {
            element.className = "tab-button";
            var activeId = element.id;
            var activeTab = document.querySelector(`div`+`#${activeId}`);
            activeTab.style.display = 'none';
        }
    });
    // activate target button
    button.className += " active";
    var id = button.id;
    var tab = document.querySelector(`div`+`#${id}`);
    tab.style.display = 'flex';
}

/**
 * Toggle color theme of the page
 */
function toggleTheme() {
    // adjust styling theme
    var container = document.querySelector('body');
    var newTheme = container.className.includes('dark') ? 'light' : 'dark';
    container.className = `container ${newTheme}`;
    //adjust canvas theme
    linkedScene.toggleTheme();
    linkedCustomizer.toggleTheme();
}
