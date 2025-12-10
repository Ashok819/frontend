const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countsDiv = document.getElementById("counts");

// Start camera
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

video.addEventListener("loadeddata", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    detectLoop();
});

async function detectLoop() {
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));

    let formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    // Replace YOUR_BACKEND_URL with Render URL
    const res = await fetch("YOUR_BACKEND_URL/detect", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    showCounts(data.counts);

    requestAnimationFrame(detectLoop);
}

function showCounts(counts) {
    countsDiv.innerHTML = "";
    for (let key in counts) {
        countsDiv.innerHTML += `<p>${key}: ${counts[key]}</p>`;
    }
}

startCamera();
