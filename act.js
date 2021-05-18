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

var eventArray = [];
var recording = false;
var starting = 0;
var ending = 0;
var but = document.getElementById('rec');
var stop = document.getElementById('stop');



window.editor.onMouseMove(e => recording && mouseMove(e))
window.editor.onMouseDown(e => recording && mouseMove(e))

function mouseMove(e) {
    let eventInstance = {
        timeStamp: performance.now(),
        event: e.event
    }
    eventArray.push(eventInstance)
}

// var el = document.getElementById('cur');
// let ed2 = document.getElementById('player');
// el.style.top = `${pos.y + ed2.offsetTop - 48}px`;
// el.style.left = `${pos.x + ed2.offsetLeft}px`;

but.addEventListener('click',e=>{
    recording = true;
    but.classList.add('recording--state-active');
    starting = e.timeStamp;
    console.log(e.timeStamp);
})

stop.addEventListener('click', e=>{
    recording = false;
    but.classList.remove('recording--state-active');
    ending = e.timeStamp;
    console.log('end')
})

var save = document.getElementById('save');
save.addEventListener('click', e => {
    console.log(eventArray);
})

window.editor.onDidChangeModelContent(e => {
    console.log(e.changes[0]);
    eventArray.push({
        timeStamp: performance.now(),
        event: e.changes[0]
    })
    window.playerEditor.executeEdits("mainEditor", e.changes);
})



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