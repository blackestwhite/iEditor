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
var startTimestamp = 0;
var pauseTimestamp = 0;
var endTimestamp   = 0;
var freePeriods    = 0;

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
function startRecord() {
    if (recording) return
    // styling
    startRecordBtn.classList.add('recording--state-active');

    // functionality
    recording = true;
    startTimestamp = performance.now();
    if (freePeriods == 0) {
        freePeriods += startTimestamp
    }else{
        freePeriods += startTimestamp - pauseTimestamp
    }
    let eventInstance = {
        timestamp: startTimestamp,
        event: 'recording started'
    }
    eventsArray.push(eventInstance)

    // logging
    console.log(`recording started at ${eventInstance.timestamp}`);
}

function pauseRecord() {
    if (!recording) return
    // styling
    startRecordBtn.classList.remove('recording--state-active');

    // functionality
    recording = false;
    pauseTimestamp = performance.now();
    let eventInstance = {
        timestamp: pauseTimestamp - freePeriods,
        event: 'recording paused'
    }
    eventsArray.push(eventInstance)
    plots.push(eventsArray);
    eventsArray = [];

    // logging
    console.log(`recording paused at ${eventInstance.timestamp}`)

}

// events
function handleModelChange(e) {
    var now = performance.now();
    eventsArray.push({
        timestamp: now - freePeriods,
        event: e
    })
    window.playerEditor.executeEdits("mainEditor", e.changes);
}
function mouseMove(e) {
    var now = performance.now();
    let eventInstance = {
        timestamp: now - freePeriods,
        event: e.event
    }
    eventsArray.push(eventInstance)
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