import { isKeyPressed } from "./keyboard";

export class CameraControls {
    constructor(app, bounds, speed){
        this.app = app;
        this.speed = speed;
        this.bounds = bounds;
    }
    spawn(){
        this.raf = {
            id: requestAnimationFrame(this.handle),
            lastCalled: performance.now()
        };
    }
    alignX = (x) => {
        return -Math.max(this.bounds[0], Math.min(-x, this.bounds[2] - window.innerWidth));
    }
    alignY = (y) => {
        return -Math.max(this.bounds[1], Math.min(-y, this.bounds[3] - window.innerHeight));
    }
    offset = (t) => {
        return Math.ceil((t-this.raf.lastCalled)*this.speed/1000);
    }
    handle = (ts) => {
        if(isKeyPressed('KeyS')){
            app.stage.y = this.alignY(app.stage.y - this.offset(ts));
        }
        if(isKeyPressed('KeyW')){
            app.stage.y = this.alignY(app.stage.y + this.offset(ts));
        }
        if(isKeyPressed('KeyA')){   
            app.stage.x = this.alignX(app.stage.x + this.offset(ts));
        }
        if(isKeyPressed('KeyD')){
            app.stage.x = this.alignX(app.stage.x - this.offset(ts));
        }
        this.raf.lastCalled = ts;
        this.raf.id = requestAnimationFrame(this.handle);
    }
}