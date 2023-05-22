import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import nebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1, 
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(0, 2, 5);
orbit.update();

//? Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

//? Plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true;

//? Grid helper
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

//? Sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
// const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false });
// const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

//? Ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//? Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightCameraHelper);

//? Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.8);
scene.add(spotLight);

spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;
spotLight.shadow.camera.bottom = -12;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

//? fog
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//? change background
  //?change color
// renderer.setClearColor(0xFF78FF);
  //?change image
// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    nebula, nebula, nebula, stars, nebula, nebula
]);

// ? dat gui data entry
const gui = new dat.GUI();

const options = {
    sphereColor: 0x0000ff,
    wireframe: false,
    speed: 0.01, 
    angle: 0.2, 
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed').min(0.01).max(0.1).step(0.01).onChange((e) => {
    speed = e;
});

gui.add(options, 'angle').min(0).max(1).step(0.01).onChange((e) => {
    spotLight.angle = e;
});

gui.add(options, 'penumbra').min(0).max(1).step(0.01).onChange((e) => {
    spotLight.penumbra = e;
});

gui.add(options, 'intensity').min(0).max(1).step(0.01).onChange((e) => {
    spotLight.intensity = e;
});

let step = 0;

function animate(time) {
    box.rotation.x = time/1000;
    box.rotation.y = time/1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
renderer.render(scene, camera);