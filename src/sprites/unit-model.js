import { AnimatedSprite } from "pixi.js";
import { applyAnimation } from "./utils";

export class UnitModel {

    constructor(stage, animations){
        this.sprite = new AnimatedSprite(animations.idle.images);
        this.animations = animations;
        this.stage = stage;
        this.raf = null;
    }

    move(){
        this.sprite.textures = this.animations.idle.images;
        this.sprite.animationSpeed = this.animations.idle.speed;
        this.sprite.anchor.x = this.animations.idle.anchor.x;
        this.sprite.anchor.y = this.animations.idle.anchor.y;
        this.sprite.play();
    }

    spawn(x, y, faceDirection='right'){
        this.faceDirection = faceDirection;
        applyAnimation(this.sprite, this.animations.idle);
        this.sprite.x = x;
        this.sprite.y = y;
        if(this.faceDirection === 'left'){
            this.sprite.scale.x *= -1;
        }
        this.stage.addChild(this.sprite);
    }

    moveTo(x, y){
        return new Promise((resolve) => {
            if(x > this.sprite.x && this.faceDirection === 'left') {
                this.faceDirection = 'right';
                this.sprite.scale.x *= -1;
                //TODO: rotation animation
            }else if(x < this.sprite.x && this.faceDirection === 'right'){
                this.faceDirection = 'left';
                this.sprite.scale.x *= -1;
                //TODO: rotation animation
            }
            applyAnimation(this.sprite, this.animations.move);
            this.movement = {
                distance: {
                    x: x - this.sprite.x, 
                    y: y - this.sprite.y 
                },
                onEnd: resolve
            };
            this.raf = {
                lastCalled: performance.now(),
                started: performance.now()
            };
            this.raf.id = requestAnimationFrame(this.onMove);
        });
    }

    onMove = (ts) => {
        const time = Math.min(this.raf.started+this.animations.move.duration, ts);
        const dt = time - this.raf.lastCalled;
        this.sprite.x += dt*this.movement.distance.x/this.animations.move.duration;;
        this.sprite.y += dt*this.movement.distance.y/this.animations.move.duration;
        this.raf.lastCalled = time;
        if(time < this.raf.started+this.animations.move.duration){
            this.raf.id = requestAnimationFrame(this.onMove);
        } else {
            this.movement.onEnd();
            applyAnimation(this.sprite, this.animations.idle);
        }
    }

}