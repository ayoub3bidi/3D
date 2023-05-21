import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();

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

//? Ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// ? dat gui data entry
const gui = new dat.GUI();

const options = {
    sphereColor: 0x0000ff,
    wireframe: false,
    speed: 0.01
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

let step = 0;

function animate(time) {
    box.rotation.x = time/1000;
    box.rotation.y = time/1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
renderer.render(scene, camera);