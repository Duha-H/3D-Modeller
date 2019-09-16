import { fileReader, drawBuildings } from '../file-controllers/fileReader.js';
import { fileGenerator } from '../file-controllers/fileGenerator.js';
import { EventHandler } from './sceneListeners.js';
import { CustomizationHandler } from './customizationListeners.js';
/**
 * Event handling module for general document-related events
 */

var tabButtons;
var linkedScene;
var linkedCustomizer;

var activeTab = '';
var tabActivatedPreviously = { // keep track of when a tab is activated for the first time
    controls: false,
    file: false,
    customize: false
}

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
        if (element.className === 'tab-button active') {
            activeTab = element.id;
        }
    });

    if (activeTab === 'controls' && !tabActivatedPreviously.controls) {
        console.log('Creating scene event handler');
        new EventHandler(linkedScene);
        tabActivatedPreviously.controls = true;
    }
    if (activeTab === 'customize' && !tabActivatedPreviously.customize) {
        console.log('Creating customization event handler');
        new CustomizationHandler(linkedCustomizer);
        tabActivatedPreviously.customize = true;
    }
}


/**
 * Handles click event for toggling between side-bar tabs
 * @param {Event} e Click event
 */
function onTabButtonClick(e) {
    let button = e.target;
    if(button.tagName !== 'INPUT') // check that a tab 'button' was actually clicked
        return;
    // deactivate active button
    //tabButtons.forEach((element) => {
    //    if(element.className.includes('active')) { // ignores selection if 
    //        element.className = "tab-button";
    //        var activeId = element.id;
    //        var activeTab = document.querySelector(`div`+`#${activeId}`);
    //        activeTab.style.display = 'none';
    //    }
    //});
    //// activate target button
    //button.className += " active";
    //var id = button.id;
    //var tab = document.querySelector(`div`+`#${id}`);
    //tab.style.display = 'flex';

    // deactivate active button
    let currActiveButton = document.querySelector(`.tab-button`+`.active`);
    currActiveButton.className = 'tab-button';
    let currActiveTab = document.querySelector(`div`+`#${activeTab}`);
    currActiveTab.style.display = 'none';

    // activate target button
    activeTab = button.id;
    button.className += ' active';
    let newTab = document.querySelector(`div`+`#${activeTab}`);
    newTab.style.display = 'flex';

    // create event handler for tab if necessary
    if (activeTab === 'controls' && !tabActivatedPreviously.controls) {
        console.log('Creating scene event handler');
        new EventHandler(linkedScene);
        tabActivatedPreviously.controls = true;
    }
    if (activeTab === 'customize' && !tabActivatedPreviously.customize) {
        console.log('Creating customization event handler');
        new CustomizationHandler(linkedCustomizer);
        tabActivatedPreviously.customize = true;
    }
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
