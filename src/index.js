import { Application } from 'pixi.js';
import { CameraControls } from './controls/camera-controls';
import {textures} from './sprites/textures';
import { loadTextures } from './sprites/utils';
import './global.css';
import { GameMap } from './game-map/game-map';
import {Kobold} from './units/kobold';
import { clickToCell } from './game-map/coordinates';
import { FogOfWarEffect } from './effects/fog-of-war-effect';

const CAMERA_BOUNDS = 100;
const CAMERA_SPEED = 300;

(async () =>
{
    const app = new Application();


    await app.init({ background: 'black', resizeTo: window  });

    document.body.appendChild(app.canvas);

    window.app = app;

    await loadTextures(textures);
    
    const gameMap = new GameMap(app.stage, textures.MAP_FOREST_FIELD);

    gameMap.spawn();

    // Move to battle controller?
    const kobold = new Kobold(app.stage, gameMap);
    kobold.spawn(10, 25);


    /*window.blockers = [];
    app.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const [col, row] = clickToCell(e, app.stage);
        const rect = new Graphics()
        .rect((col-1)*70, (row-1)*70, 70, 70)
        .fill('red');

       app.stage.addChild(rect);
       window.blockers.push([col, row]);
    });*/

    const fogOfWar = new FogOfWarEffect(app.stage, gameMap);

    fogOfWar.update(kobold);

    // Move to Player Controller?
    app.canvas.addEventListener('click', (e) => {
        const [col, row] = clickToCell(e, app.stage);
        kobold.moveTo(col, row).then(() => {
            fogOfWar.update(kobold);
        });
    });
    

    const cameraControls = new CameraControls(app, [0-CAMERA_BOUNDS, 0-CAMERA_BOUNDS, gameMap.sprite.width+CAMERA_BOUNDS, gameMap.sprite.height+CAMERA_BOUNDS], CAMERA_SPEED);
    
    cameraControls.spawn();
})();

