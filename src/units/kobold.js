import { cellsToCoords} from '../game-map/coordinates';
import {textures} from '../sprites/textures';
import { UnitModel } from "../sprites/unit-model";

export class Kobold {

    constructor(stage, gameMap){
        this.model = new UnitModel(stage, {
            idle: textures.CREEP_KOBOLD_IDLE,
            move: textures.CREEP_KOBOLD_MOVE
        });
        this.stage = stage;
        this.gameMap = gameMap;
        this.vision = 5;
    }

    spawn(col, row, faceDirection='right'){
        const [x, y] = cellsToCoords(col, row);
        this.position = [col, row];
        this.model.spawn(x, y, faceDirection);
    }

    isReacheble(col, row){
        if(Math.abs(col - this.position[0]) + Math.abs(row - this.position[1]) !== 1){
            return false;
        }
        const targetTerrain = this.gameMap.getTerrain(col, row);
        const currentTerrain = this.gameMap.getTerrain(this.position[0], this.position[1]);
        const targetHeight = this.gameMap.getHeight(col, row);
        const currentHeight = this.gameMap.getHeight(this.position[0], this.position[1]);
        if(currentHeight > targetHeight && currentTerrain === 'cliffs'){ // нельзя спрыгнуть с выступа
            return false;
        }
        if(currentHeight < targetHeight && targetTerrain === 'cliffs'){ // нельзя подняться на выступ
            return false;
        }
        if(['forest', 'rocks', 'water', 'snags'].includes(targetTerrain)){
            return false;
        }
        return true;
    }

    moveTo(col, row){
        return new Promise(resolve => {
            if(!this.isReacheble(col, row)){
                resolve();
                return;
            }
            const [x, y] = cellsToCoords(col, row);
            this.model.moveTo(x,y).then(() => {
                this.position = [col, row];
            }).then(resolve);
        })
    }

}