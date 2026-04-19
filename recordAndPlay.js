let mediaRecorder;
let audioChunks = [];
let stream = null;

let count = 1;
const maxCount = 12;
const counter = document.getElementById("counter");
const nextBtn = document.getElementById("nextBtn");

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const recordingAudios = document.getElementById("recordingAudios");

const audio = document.getElementById("audio");

const CANDIDATES = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4",   
    "audio/wav",   
    "audio/webm",
];

const mimeType = CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
if (!mimeType) 
{
    throw new Error("対応MIMEが見つかりません");
}

let lastBlob = null;
const savedAudios = [];

recordBtn.onclick = async () => {
    if (!stream) 
    {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    

    mediaRecorder = new MediaRecorder(stream,{mimeType});

    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioURL = URL.createObjectURL(audioBlob);
        lastBlob = audioBlob;
        
        audio.src = audioURL;
    };

    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
};

stopBtn.onclick = () => {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
    nextBtn.disabled = false;
    };

nextBtn.onclick = () =>{
    if (lastBlob) 
    {
        savedAudios.push(lastBlob);
        console.log("保存された音声一覧:", savedAudios);
    }

    audio.src = "";
    lastBlob = null;

    if(count < maxCount)
    {
        count++;
    }
    counter.textContent = `${count}/${maxCount}`;

    nextBtn.disabled = true;
}