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
var playRecordBtn  = document.getElementById('play');

window.editor.onMouseMove(e => recording && mouseMove(e))
window.editor.onMouseDown(e => recording && mouseMove(e))
window.editor.onDidChangeModelContent(e => recording && handleModelChange(e))

startRecordBtn.addEventListener('click', startRecord)
pauseRecordBtn.addEventListener('click', pauseRecord)
playRecordBtn.addEventListener('click', playRecord)

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
function playRecord() {
    console.log(recording)
    if (recording) return
    // styling
    startRecordBtn.classList.remove('recording--state-active');

    // functionality
    playstart = performance.now();
    playing = true

    playRec()
    
}

function handleModelChange(e) {
    var now = performance.now();
    eventsArray.push({
        timestamp: now - freePeriods,
        event: e
    })
}

function mouseMove(e) {
    var now = performance.now();
    let eventInstance = {
        timestamp: now - freePeriods,
        event: e.event
    }
    eventsArray.push(eventInstance)
}


var playing = false;
// execute edit in 60 frames per second
var playstart

function playRec() {


    console.log("playing state: ", playing);
    if (!playing) return
    playstart = performance.now();
    plots.forEach(plot => {
        plot.forEach(item => {
            if (item.event.changes)
                var inter = setInterval(()=>{
                    treshold = window.performance.now() - playstart
                    if (treshold > item.timestamp) {
                        playerEditor.executeEdits("mainEditor", item.event.changes)
                        clearInterval(inter)
                        plot.shift()
                    }
                })
        })
    })

    
}


// playerEditor.executeEdits("mainEditor", item.event.changes)