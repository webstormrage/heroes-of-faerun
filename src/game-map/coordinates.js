import { CELL_SIZE } from "./constants";

export const cellsToCoords = (i, j) => {
    const yOffset = CELL_SIZE;
    const xOffset = CELL_SIZE/2;
    return [(i-1)*CELL_SIZE+xOffset, (j-1)*CELL_SIZE+yOffset];
}

export const coordsToCell = (x,y) => {
    return [Math.ceil(x/CELL_SIZE), Math.ceil(y/CELL_SIZE)];
}

export const clickToCell = (event, stage) => {
    const x = event.clientX - stage.x;
    const y = event.clientY - stage.y;
    return coordsToCell(x,y);
}