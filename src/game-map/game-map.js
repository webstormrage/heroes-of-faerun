import {Sprite} from 'pixi.js';
import { CELL_SIZE } from './constants';

const extractTerrainOfType = (col, row, environmentType) => {
    return Boolean(environmentType.find(([x,y]) => x===col && y === row));
}

const extractTerrain = (col, row, environment) => {
    const priority = ['cliffs', 'water', 'forest', 'rocks', 'snags', 'puddle'];
    for(const terrain of priority){
        if(extractTerrainOfType(col, row, environment[terrain])){
            return terrain;
        }
    }
    return 'default';
}

const createTerrain = (width, height, environment) => {
     const terrain = new Array(width).fill([]).map(() => new Array(height).fill('default'));
     for(let col = 1; col <= width; ++col){
        for(let row = 1; row <= height; ++row){
            terrain[col-1][row-1] = extractTerrain(col, row, environment);
        }
     }
     return terrain;
}

const extractTopography = (col, row, topography) => {
    const entry = Object.entries(topography).find(([_,list]) => {
        return list.find(([x,y]) => x===col && y === row);
    });
    if(!entry){
        return 0;
    }
    return Number(entry[0]);
};

const createTopography = (width, height, topography) => {
    const topographyMask = new Array(width).fill([]).map(() => new Array(height).fill(0));
    for(let col = 1; col <= width; ++col){
       for(let row = 1; row <= height; ++row){
        topographyMask[col-1][row-1] = extractTopography(col, row, topography);
       }
    }
    return topographyMask;
}


export class GameMap {

    static startView = [0, -875];

    constructor(stage, texture){
        this.sprite = Sprite.from(texture.image);
        this.stage = stage;
        this.width = this.sprite.width/CELL_SIZE;
        this.height = this.sprite.height/CELL_SIZE;
        this.terrain = createTerrain(this.width, this.height, texture.environment);
        this.topography = createTopography(this.width, this.height, texture.topography);
    }

    getBounds(){
        return [this.width/70, this.height/70];
    }

    spawn(){
        this.stage.addChild(this.sprite);
        this.stage.x = GameMap.startView[0];
        this.stage.y = GameMap.startView[1];
    }

    getTerrain(col, row){
        return this.terrain[col-1][row-1];
    }

    getHeight(col, row){
        return this.topography[col-1][row-1];
    }

}