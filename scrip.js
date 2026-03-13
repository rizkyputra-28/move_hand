const video = document.getElementById("video");

async function startCamera() {
  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480
      },
      audio: false
    });

    video.srcObject = stream;

  } catch (err) {
    alert("Webcam tidak ditemukan atau tidak diizinkan");
    console.log(err);
  }
}

startCamera();