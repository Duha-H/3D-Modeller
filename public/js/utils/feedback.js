// User interaction feedback elements

/**
 * Displays a temporary snackbar message
 * @param {String} message snackbar message
 */
export function showSnackbar(message) {
    snackbar = document.getElementById("snackbar");
    snackbar.innerText = message;
    snackbar.className = "show";

    // remove snackbar after 3 seconds
    setTimeout(() => { snackbar.className = "" }, 3000);
}