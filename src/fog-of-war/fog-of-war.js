import { createVisionMask, markCone, markRect, joinMasks } from "./utils";

export class FogOfWar {
    constructor(gameMap){
        this.gameMap = gameMap;
        this.bounds = gameMap.getBounds();
        this.visionMasks = new Map();
        this.groupVisionMask = createVisionMask(this.gameMap.width, this.gameMap.height);
    }

    update(unit){
        const [x, y] = unit.position;
        const unitH = this.gameMap.getHeight(x,y);
        const visionMask = createVisionMask(this.gameMap.width, this.gameMap.height);
        markRect(x-unit.vision, y-unit.vision, unit.vision*2+1,  unit.vision*2+1, 1, visionMask);
        const highGround = createVisionMask(this.gameMap.width, this.gameMap.height);
        const lowGround = createVisionMask(this.gameMap.width, this.gameMap.height);
        for(let i = Math.max(1, x-unit.vision); i <= Math.min(this.gameMap.width, x+unit.vision); ++i){
            for(let j = Math.max(1, y-unit.vision); j <= Math.min(this.gameMap.height, y+unit.vision); ++j) {
                const h = this.gameMap.getHeight(i,j);
                if(unitH > h) {
                    lowGround[i-1][j-1] = 1;
                }
                if(unitH < h) {
                    highGround[i-1][j-1] = 1;
                    visionMask[i-1][j-1] = 0; // хайграунд не видно
                }
            }
        }
        for(let i = Math.max(1, x-unit.vision); i <= Math.min(this.gameMap.width, x+unit.vision); ++i){
            for(let j = Math.max(1, y-unit.vision); j <= Math.min(this.gameMap.height, y+unit.vision); ++j) {
                if(!highGround[i-1][j-1] && !lowGround[i-1][j-1] && ['rocks','forest'].includes(this.gameMap.getTerrain(i,j))) { // фильтруем препятствия на том же уровне
                    markCone(i, j, x, y, unit.vision - Math.max(Math.abs(x-i), Math.abs(y-j)), 0, visionMask);
                }
            }
        }
        this.visionMasks.set(unit, visionMask);
        for(const [unit, visionMask] of this.visionMasks){
            this.groupVisionMask = createVisionMask(this.gameMap.width, this.gameMap.height);
            joinMasks(this.groupVisionMask, visionMask);
        }
    }

    remove(unit){
        this.visionMasks.delete(unit);
    }

    getVision(){
        return this.groupVisionMask;
    }
}