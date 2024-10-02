

export const isPathible = (col, row, unit) => {
    return Math.abs(col-unit.position[0]) + Math.abs(row-unit.position[1]) === 1;
};