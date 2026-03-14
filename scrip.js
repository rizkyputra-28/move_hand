/* KONFIGURASI CANVAS & RENDERER */
const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");

// Menghilangkan Mirror pada Video & Canvas (CSS)
videoElement.style.transform = "scaleX(-1)";
canvasElement.style.transform = "scaleX(1)";

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

/* THREE.JS SETUP */
const scene = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
// Menghilangkan Mirror pada output Three.js
renderer.domElement.style.transform = "scaleX(-1)"; 

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera3D.position.z = 5;

/* MEDIAPIPE LOGIC */
function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Tampilkan gambar kamera di canvas (Opsional jika video sudah tampil)
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const hand = results.multiHandLandmarks[0];

        // Titik telunjuk (Index Finger Tip)
        const x = hand[8].x; 
        const y = hand[8].y;
        const z = hand[8].z;

        // Mapping Koordinat MediaPipe (0 ke 1) ke Three.js (World Units)
        // Karena kita sudah scaleX(-1) di CSS, kita tidak perlu membalikkan X di sini
        cube.position.x = (x - 0.5) * 10; 
        cube.position.y = -(y - 0.5) * 7;
        cube.position.z = -z * 10; // Memberikan efek kedalaman

        // Rotasi berdasarkan posisi tangan
        cube.rotation.y = x * Math.PI;
        cube.rotation.x = y * Math.PI;

        // Gambar Landmark di atas Canvas
        drawConnectors(canvasCtx, hand, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
        drawLandmarks(canvasCtx, hand, {color: '#FF0000', lineWidth: 2});
    }
    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

/* CAMERA START */
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});
camera.start();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera3D);
}
animate();