var editor = monaco.editor.create(document.getElementById("container"), {
	value: "",
    language: "javascript",
    theme: "vs-dark",
});


var eventArray = [];
var mouseEvents = [];
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
    {key: 'Enter', action: 'type', data: {text: '\n'}},
    {key: 'ContextMenu', action: 'editor.action.showContextMenu'},
    {key: 'Escape', action: null}
];


window.editor.onKeyDown( (event) => {
    if (recording) {
        var special = specials.filter(action => action.key == event.browserEvent.key)
        if (special.length != 0){
            //its special cmd
            console.log(special);
            eventArray.push({eventType: special[0].action, eventThen: special[0].data , eventTime: window.performance.now() - starting})
        }else{
            console.log(event.browserEvent.key);
            eventArray.push({eventType: 'type', eventData:{text: event.browserEvent.key}, eventTime: window.performance.now() - starting})
        }
    }
});

window.editor.onMouseMove( e => {
    if (recording){
        mouseEvents.push({e, t: window.performance.now() - starting})
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
        setTimeout(()=>{
            playerEditor.trigger(null,item.eventType, item.eventData)
            if(item.eventThen) {
                playerEditor.trigger(null, item.eventType, item.eventThen)
            }
        }, item.eventTime)

    })


    mouseEvents.forEach( item => {
        let cur = document.getElementById('cur');
        setTimeout(()=>{
            var ed2 = document.getElementById('player');
            cur.style.top = `${ed2.offsetTop + item.e.event.posy -48}px`;
            cur.style.left = `${ed2.offsetLeft + item.e.event.posx}px`;
        }, item.t)
    })
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
