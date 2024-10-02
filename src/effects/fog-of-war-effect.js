import { FogOfWar } from "../fog-of-war/fog-of-war";
import { Graphics } from "pixi.js";
import { CELL_SIZE } from "../game-map/constants";

const createCellShade = (col, row) => {
    return new Graphics()
        .rect((col-1)*CELL_SIZE, (row-1)*CELL_SIZE, CELL_SIZE, CELL_SIZE)
        .fill('rgba(0,0,0,0.8)');
}

export class FogOfWarEffect {
    constructor(stage, gameMap){
        this.stage = stage;
        this.gameMap = gameMap;
        this.fogOfWar = new FogOfWar(gameMap);
        this.shadedAreas = new Array(gameMap.width).fill([]).map(() => new Array(gameMap.height).fill(null));
    }

    update(unit){
        this.fogOfWar.update(unit);
        this.render();
    }

    remove(unit){
        this.fogOfWar.remove(unit);
        this.render();
    }

    render(){
        const visionMask = this.fogOfWar.getVision();
        for(let i = 0; i < visionMask.length; ++i){
            for(let j = 0; j < visionMask[i].length; ++j){
                if(visionMask[i][j] === 0 && !this.shadedAreas[i][j]){ // нужно добавить тень
                    this.shadedAreas[i][j] = createCellShade(i+1,j+1);
                    this.stage.addChild(this.shadedAreas[i][j]);
                } else if(visionMask[i][j] === 1 && this.shadedAreas[i][j]) { // нужно удалить тень
                    this.stage.removeChild(this.shadedAreas[i][j]);
                    this.shadedAreas[i][j] = null;
                }
            }
        }
    }
}