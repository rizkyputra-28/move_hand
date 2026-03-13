const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

/* THREE JS */

const scene = new THREE.Scene();

const camera3D = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);

renderer.domElement.style.position="absolute";
renderer.domElement.style.top="0";
renderer.domElement.style.left="0";

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
color:0x00ffff,
wireframe:true
});

const cube = new THREE.Mesh(geometry,material);

scene.add(cube);

camera3D.position.z=5;

function animate(){

requestAnimationFrame(animate);

renderer.render(scene,camera3D);

}

animate();


/* MEDIAPIPE */

const hands = new Hands({
locateFile:(file)=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}
});

hands.setOptions({
maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.7
});


function onResults(results){

canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);

if(results.multiHandLandmarks){

const hand = results.multiHandLandmarks[0];

const x = hand[8].x;
const y = hand[8].y;

cube.position.x=(x-0.5)*6;
cube.position.y=-(y-0.5)*4;

cube.rotation.y=x*5;
cube.rotation.x=y*5;

drawConnectors(canvasCtx,hand,HAND_CONNECTIONS);
drawLandmarks(canvasCtx,hand);

}

}

hands.onResults(onResults);


/* CAMERA */

const camera = new Camera(videoElement,{
onFrame: async ()=>{
await hands.send({image:videoElement});
},
width:640,
height:480
});

camera.start();