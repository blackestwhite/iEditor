var editor = monaco.editor.create(document.getElementById("container"), {
	value: "",
    language: "javascript",
    theme: "vs-dark",
});

var playerEditor = monaco.editor.create(document.getElementById("player"), {
    value: "",
    language: "javascript",
    theme: "vs-dark",
});

var plots          = [];
var eventsArray    = [];
var recording      = false;
var psTimestamp    = 0;
// var pauseTimestamp = 0;
var endTimestamp   = 0;

var startRecordBtn = document.getElementById('rec');
var pauseRecordBtn = document.getElementById('pause');
var saveRecordBtn  = document.getElementById('save');

window.editor.onMouseMove(e => recording && mouseMove(e))
window.editor.onMouseDown(e => recording && mouseMove(e))
window.editor.onDidChangeModelContent(e => recording && handleModelChange(e))

startRecordBtn.addEventListener('click', startRecord)
pauseRecordBtn.addEventListener('click', pauseRecord)

// var el = document.getElementById('cur');
// let ed2 = document.getElementById('player');
// el.style.top = `${pos.y + ed2.offsetTop - 48}px`;
// el.style.left = `${pos.x + ed2.offsetLeft}px`;


saveRecordBtn.addEventListener('click', e => {
    console.log(plots);
})


// functions
function mouseMove(e) {
    var now = performance.now();
    let eventInstance = {
        timestamp: now + (now - psTimestamp),
        event: e.event
    }
    eventsArray.push(eventInstance)
}

function startRecord() {
    if (recording) return
    recording = true;
    startRecordBtn.classList.add('recording--state-active');
    psTimestamp = performance.now();
    let eventInstance = {
        timestamp: psTimestamp,
        event: 'recording started'
    }
    eventsArray.push(eventInstance)
    console.log(`recording started at ${psTimestamp}`);
}

function pauseRecord() {
    if (!recording) return
    var now = performance.now()
    recording = false;
    startRecordBtn.classList.remove('recording--state-active');
    psTimestamp = now + (now - psTimestamp);
    let eventInstance = {
        timestamp: psTimestamp,
        event: 'recording paused'
    }
    eventsArray.push(eventInstance)
    plots.push(eventsArray);
    eventsArray = [];
    console.log(`recording paused at ${psTimestamp}`)

}

function handleModelChange(e) {
    var now = performance.now();
    eventsArray.push({
        timestamp: now + (now - psTimestamp),
        event: e
    })
    window.playerEditor.executeEdits("mainEditor", e.changes);
}

















// if (navigator.mediaDevices) {
//     console.log('getUserMedia supported.');

//     var constraints = { audio: true};
//     var chunks = [];

//     navigator.mediaDevices.getUserMedia(constraints).then(stream=>{
//         var mediaRecorder = new MediaRecorder(stream);

//         but.addEventListener('click',()=>{
//             mediaRecorder.start();
//         })
//         stop.addEventListener('click',()=>{
//             mediaRecorder.pause();
//         })
//         save.addEventListener('click',()=>{
//             mediaRecorder.stop();
//         })

//         mediaRecorder.onstop = function(e) {
//             console.log("data available after MediaRecorder.stop() called.");
        
//             var clipName = 'Enter a name for your sound clip';
        
//             var clipContainer = document.createElement('article');
//             var clipLabel = document.createElement('p');
//             var audio = document.createElement('audio');
//             var deleteButton = document.createElement('button');
        
//             clipContainer.classList.add('clip');
//             audio.setAttribute('controls', '');
//             deleteButton.innerHTML = "Delete";
//             clipLabel.innerHTML = clipName;
        
//             clipContainer.appendChild(audio);
//             clipContainer.appendChild(clipLabel);
//             clipContainer.appendChild(deleteButton);
//             document.body.appendChild(clipContainer);
        
//             audio.controls = true;
//             var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
//             chunks = [];
//             var audioURL = URL.createObjectURL(blob);
//             audio.src = audioURL;
//             console.log("recorder stopped");
//             audio.play();
//             deleteButton.onclick = function(e) {
//                 evtTgt = e.target;
//                 evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
//             }
//         }

//         mediaRecorder.ondataavailable = function(e) {
//             chunks.push(e.data);
//         }
//     })
// }