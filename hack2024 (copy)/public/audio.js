let mediaRecorder;
let audioChunks = [];
const startStopButton = document.getElementById('startStopButton');
const uploadButton = document.getElementById('uploadButton');
const audioPlayback = document.getElementById('audioPlayback');
let audioBlob;



startStopButton.addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();

    } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioChunks = [];

            // Subir el archivo al servidor
            uploadAudioFile(audioBlob);
        };

        mediaRecorder.start();
    }
});

function uploadAudioFile(blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');
    console.log(formData);
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    // .then(data => {
    //     console.log(data);
    //     alert('Archivo subido con éxito.');
    //     uploadButton.disabled = true;
    // })
}