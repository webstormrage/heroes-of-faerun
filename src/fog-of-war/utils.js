export const createVisionMask = (width, height) => {
    return new Array(width).fill(0).map(() => new Array(height).fill(0));
}

export const markRect = (x0, y0, width, height, value, visionMask) => {
    for(let i = Math.max(1, x0); i <= Math.min(visionMask.length, x0+width-1); ++i){
        for(let j = Math.max(1, y0); j <= Math.min(visionMask[i-1].length, y0+height-1); ++j){
            visionMask[i-1][j-1] = value;
        }
    }
}

export const markPinkedRect = (x0, y0,  width, height, value, visionMask, px, py) => {
    for(let i = Math.max(1, x0); i <= Math.min(visionMask.length, x0+width-1); ++i){
        for(let j = Math.max(1, y0); j <= Math.min(visionMask[i-1].length, y0+height-1); ++j){
            if(i !== px || j !== py){
                visionMask[i-1][j-1] = value;
            }
        }
    }
}

export const markCone = (x, y, fx, fy, size, value, visionMask) => {
    if(x+y === fx+fy) { // вторая диагональ
        if(fx < x){
            const s0 = size+1;
            markPinkedRect(x, y-s0+1, s0, s0, value, visionMask, x, y);
        } else {
            const s0 = size+1;
            markPinkedRect(x-s0+1, y, s0, s0, value, visionMask, x, y);
        }
    } else if(x-y == fx-fy){ // основная диагональ
        if(fx < x) {
            const s0 = size+1;
            markPinkedRect(x, y, s0, s0, value, visionMask, x, y);
        } else {
            const s0 = size+1;
            markPinkedRect(x-s0+1, y-s0+1, s0, s0, value, visionMask, x, y);
        }
    } else if(fx-fy > x-y && fx+fy > x+y){ // левый конус
        const x0 = x-1;
        const y0 = y;
        if(fy < y){ // конус обрезан сверху
            for(let d = 0; d < size; ++d) {
                markRect(x0-d, y0, 1, Math.floor(d/2)+1, value, visionMask);
            }
        } else if(fy > y){// конус обрезан снизу
            for(let d = 0; d < size; ++d) {
                markRect(x0-d, y0-Math.floor(d/2), 1, Math.floor(d/2)+1, value, visionMask);
            }
        } else { // конус не обрезан
            for(let d = 0; d < size; ++d) {
                markRect(x0-d, y0-Math.floor(d/2), 1, d+1-d%2, value, visionMask);
            }
        }
    } else if(fx-fy > x-y && fx+fy < x+y){ // нижний конус
        const x0 = x;
        const y0 = y+1;
        if(fx < x) { //конус обрезан слева
            for(let d = 0; d < size; ++d) {
                markRect(x0, y0+d, Math.floor(d/2)+1, 1, value, visionMask);
            }
        } else if(fx > x) { // конус обрезан справа
            for(let d = 0; d < size; ++d) {
                markRect(x0-Math.floor(d/2), y0+d, Math.floor(d/2)+1, 1, value, visionMask);
            }
        } else { // конус не обрезан
            for(let d = 0; d < size; ++d) {
                markRect(x0-Math.floor(d/2), y0+d, d+1-d%2, 1, value, visionMask);
            }
        }
    } else if(fx-fy <x-y && fx+fy <x+y) { //правый конус
        const x0 = x+1;
        const y0 = y;
        if(fy < y){ // конус обрезан сверху
            for(let d = 0; d < size; ++d) {
                markRect(x0+d, y0, 1, Math.floor(d/2)+1, value, visionMask);
            }
        } else if(fy > y){// конус обрезан снизу
            for(let d = 0; d < size; ++d) {
                markRect(x0+d, y0-Math.floor(d/2), 1, Math.floor(d/2)+1, value, visionMask);
            }
        } else { // конус не обрезан
            for(let d = 0; d < size; ++d) {
                markRect(x0+d, y0-Math.floor(d/2), 1, d+1-d%2, value, visionMask);
            }
        }
    } else { // верхний конус
        const x0 = x;
        const y0 = y-1;
        if(fx < x) { //конус обрезан слева
            for(let d = 0; d < size; ++d) {
                markRect(x0, y0-d, Math.floor(d/2)+1, 1, value, visionMask);
            }
        } else if(fx > x) { // конус обрезан справа
            for(let d = 0; d < size; ++d) {
                markRect(x0-Math.floor(d/2), y0-d, Math.floor(d/2)+1, 1, value, visionMask);
            }
        } else { // конус не обрезан
            for(let d = 0; d < size; ++d) {
                markRect(x0-Math.floor(d/2), y0-d, d+1-d%2, 1, value, visionMask);
            }
        }
    }
}

export const joinMasks = (m1, m2) => {
    for(let i = 0; i < m1.length; ++i){
        for(let j = 0; j < m1[i].length; ++j){
            m1[i][j] = m1[i][j] || m2[i][j];
        }
    }
}