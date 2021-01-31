var editor = monaco.editor.create(document.getElementById("container"), {
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
var specials = [
    {key: 'ArrowUp', action: 'cursorUp'},
    {key: 'ArrowDown', action: 'cursorDown'},
    {key: 'ArrowLeft', action: 'cursorLeft'},
    {key: 'ArrowRight', action: 'cursorRight'},
    {key: 'Backspace', action: 'deleteLeft'},
    {key: 'Delete', action: 'deleteRight'},
    {key: 'Control', action: null},
    {key: 'Shift', action: null},
    {key: 'CapsLock', action: null},
    {key: 'Enter', action: null},
    {key: 'ContextMenu', action: 'editor.action.showContextMenu'},
    {key: 'Escape', action: null}
];


window.editor.onKeyDown( (event) => {
    if (recording) {
        var special = specials.filter(action => action.key == event.browserEvent.key)
        if (special.length != 0){
            //its special cmd
            console.log(special[0]);
            var itemToPush = {eventRelatesTo: 'keyboard-sp', eventData: specials[0], timeStamp: window.performance.now() - starting}
            eventArray.push(itemToPush)
        }else{
            var itemToPush = {eventRelatesTo: 'keyboard', eventData: event, timeStamp: window.performance.now() - starting}
            eventArray.push(itemToPush)
        }
    }
});

window.editor.onMouseMove( e => {
    if (recording){
        var itemToPush = {eventRelatesTo: 'mouse', eventData: e, timeStamp: window.performance.now() - starting};
        eventArray.push(itemToPush)
    }
})



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




var playerEditor = monaco.editor.create(document.getElementById("player"), {
    value: "",
    language: "javascript",
    theme: "vs-dark",
});

var save = document.getElementById('save');
save.addEventListener('click', e => {
    eventArray.forEach(item => {
        if(item.eventRelatesTo == 'mouse'){
            //trigger click, mouse movements
            let ed2 = document.getElementById('player');
            let cur = document.getElementById('cur');
            setTimeout(()=>{
                cur.style.top = `${item.eventData.event.posy + ed2.offsetTop - 48}px`;
                cur.style.left = `${item.eventData.event.posx + ed2.offsetLeft}px`;
            }, item.timeStamp)
        }else if(item.eventRelatesTo == 'keyboard'){
            //trigger type
            setTimeout(()=>{
                playerEditor.trigger(null, 'type', {text: item.eventData.browserEvent.key})
            }, item.timeStamp)
        }else{
            //special cmd keys
        }
    })
})


//event


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
