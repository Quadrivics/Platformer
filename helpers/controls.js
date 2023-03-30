// Handle keyboard input
export const keys = [];
document.addEventListener("keydown", event => {
    keys[event.keyCode] = true;
});
document.addEventListener("keyup", event => {
    keys[event.keyCode] = false;
});