import * as THREE from './resources/three.module.js';
import {GLTFLoader} from './resources/GLTFLoader.js';
//import { FlyControls } from './resources/FlyControls.js'
import {OrbitControls} from './resources/OrbitControls.js';

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

const controls = new OrbitControls(camera, renderer.domElement);

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
const loader = new GLTFLoader();
loader.load('./models/scene.gltf', function(gltf){
    const ship = gltf.scene.children[0];
    ship.scale.set(0.5,0.5,0.5);
    scene.add(gltf.scene);
    console.log("ship has been loaded")
});

//game logic
const update = () => {
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