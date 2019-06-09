import { readFile } from '../file-controllers/fileHandler.js';
import { fileGenerator } from '../file-controllers/fileGenerator.js';

/**
 * Event handling module for general document-related events
 */

var tabButtons;

/**
 * Assigns/binds all event listeners for general document elements
 */
export function PageEventHandler(scene) {
    tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length !== 0)
        handleTabButtons();

    var downloadButton = document.getElementById('download');
    downloadButton.addEventListener('click', () => { fileGenerator(scene) }, false);
    //fileGenerator(scene);
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
    console.log('this: ', button);
    // deactivate active button
    tabButtons.forEach((element) => {
        if(element.className.includes('active')) {
            element.className = "tab-button";
            var activeId = element.id;
            var activeTab = document.querySelector(`div`+`#${activeId}`);
            activeTab.style.display = 'none';
        }
    });
    // activate target button
    button.className += " active";
    var id_ = button.id;
    var tab = document.querySelector(`div`+`#${id_}`);
    tab.style.display = 'flex';
    console.log("tab:",tab);
}
