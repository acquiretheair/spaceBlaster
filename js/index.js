import * as THREE from './resources/three.module.js';
import {GLTFLoader} from './resources/GLTFLoader.js';
import {OrbitControls} from './resources/OrbitControls.js';
//import { FlyControls } from './resources/FlyControls.js' //Nah son, we doing our own!!


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
camera.position.set(-900,-200,-900);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Responsive Design
window.addEventListener('resize', () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const cameraControls = new OrbitControls(camera, renderer.domElement);

//create the skybox
const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
const skyboxMaterials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/skybox/corona_ft.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/skybox/corona_bk.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/skybox/corona_up.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/skybox/corona_dn.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/skybox/corona_rt.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/skybox/corona_lf.png"), side: THREE.DoubleSide})
];
const skybox = new THREE.Mesh(skyboxGeo, skyboxMaterials);
scene.add(skybox);

//add ambient light
const hlight = new THREE.AmbientLight(0xFFFFFF,5);
scene.add(hlight);

//load ship
let ship;
let shipControls;
let shipIsLoaded = false;
const loader = new GLTFLoader();
loader.load('./models/scene.gltf', function(gltf){
    ship = gltf.scene.children[0];
    ship.scale.set(0.5,0.5,0.5);
    scene.add(gltf.scene);

    shipIsLoaded = true;
});

//shipControls
let forward = false;
let backward = false;
let left = false;
let right = false;


//TODO: Abstract _keydown and _keyup into a single woopt.
const _keydown = (event) => {
    switch(event.key){
        case 'w':
            forward = true;
            console.log('forward is: ', forward);
            break;
        case 's':
            backward = true;
            console.log('backward is: ', backward);
            break;
        case 'a':
            left = true;
            console.log('left is: ', left);
            break;
        case 'd':
            right = true;
            console.log('right is: ', right);
            break;   
    }
}

const _keyup = (event) => {
    switch(event.key){
        case 'w':
            forward = false;
            console.log('forward is: ', forward);
            break;
        case 's':
            backward = false;
            console.log('backward is: ', backward);
            break;
        case 'a':
            left = false;
            console.log('left is: ', left);
            break;
        case 'd':
            right = false;
            console.log('right is: ', right);
            break;   
    }
}

//Might be better to relegate these down to a particular domElement rather than window
window.addEventListener('keydown', _keydown);
window.addEventListener('keyup', _keyup);


//updates the ship if it is loaded
//Note: Account for the case when you have both forward and bacward, left and right going, that'll be in the shipUpdate()
const conditionalUpdate = () =>{
    if(shipIsLoaded){
        if(forward && !backward){
            ship.position.z += 1;
        }
        if(backward && !forward){
            ship.position.z -= 1;
        }
        if(left && !right){
            ship.position.x += 1;
        }
        if(right && !left){
            ship.position.x -= 1;
        }
    }
}


//game logic
//Test if this shit runs okay if things aren't quite loaded yet
const update = () => {
    conditionalUpdate();
};

//draw Scene
const render = () => {
    renderer.render(scene, camera);
};

//run gameLoop (update, render, repeat)
const gameLoop = () => {
    requestAnimationFrame(gameLoop);
    update();
    render();
};
gameLoop();