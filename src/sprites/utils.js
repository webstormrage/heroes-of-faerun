import { Assets } from 'pixi.js';

export const initTextures = (textures) => {
    Object.values(textures).filter(t => t.type === 'animated').forEach(t => {
        t.paths = t.frames.flatMap(([row, lastCol]) => {
            const names = [];
            for(let i = 0; i  <= lastCol; ++i){
                names.push(`/${t.namespace}/${row}-${i}.png`);
            }
            return names;
        });
    });
};


export const loadTextures = (textures) => {
    return Promise.all(Object.values(textures).flatMap((props) => {
        if(props.paths){
            return props.paths.map(path => Assets.load(path).then(texture => {
                props.images.push(texture);
                return texture;
            }));
        }
        return  Assets.load(props.path).then(texture => {
            props.image = texture;
            return texture;
        });
    }));
};

export const applyAnimation = (sprite, texture) => {
    sprite.textures = texture.images;
    sprite.animationSpeed = texture.speed;
    sprite.anchor.x = texture.anchor.x;
    sprite.anchor.y = texture.anchor.y;
    sprite.play();
};