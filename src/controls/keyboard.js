
const keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});

export function isKeyPressed(code){
    return Boolean(keysPressed[code]);
}