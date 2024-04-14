// import {generateRtcToken} from './token_generator.js';

const APP_ID = '52003bfaad2b412caaae9b88f9761367';
let TOKEN = sessionStorage.getItem('token');
let CHANNEL = sessionStorage.getItem('room');
let UID = Number(sessionStorage.getItem('UID'));
const CERT = '0925ad883f584ab19dbafef8b46c260f';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
    document.getElementById('room-name').innerText = CHANNEL;
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    console.log(`UID--${UID} AND CHANNEL--${CHANNEL}`);
    try {
        await client.join(APP_ID, CHANNEL, TOKEN, UID);
    } catch (error) {
        console.error(error);
    }

    console.log(`i am user with uid-->${UID}`);

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`;
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

    localTracks[1].play(`user-${UID}`);

    await client.publish([localTracks[0], localTracks[1]]);
    console.log(`i am user with uid-->${UID}`);
};

let joinStream = async (event) => {
    event.preventDefault();

    // Access the value of the room input field
    const roomName = event.target.room.value;

    // Now you can do something with the room name, such as logging it to the console
    console.log("Room name:", roomName);
    let response = await fetch(`/get_token/${roomName}`);
    let data = await response.json();
    console.log(data);
    UID = data.uid; // Update the global UID variable instead of creating a new local one
    let token = data.token;

    sessionStorage.setItem('UID', UID);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('room', roomName);

    TOKEN = sessionStorage.getItem('token');
    CHANNEL = sessionStorage.getItem('room');
    UID = Number(sessionStorage.getItem('UID'));
    console.log(`in join stream->UID--${UID} AND CHANNEL--${CHANNEL}`);

    await joinAndDisplayLocalStream();
    document.getElementById('join-btn').style.display = 'none';
    document.getElementById('stream-controls').style.display = 'flex';
};

let handleUserJoined = async (user, mediaType) => {
    console.log("entered");
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (player != null) {
            player.remove();
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`;
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
};

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
};

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop();
        localTracks[i].close();
    }

    await client.leave();
    document.getElementById('join-btn').style.display = 'block';
    document.getElementById('stream-controls').style.display = 'none';
    document.getElementById('video-streams').innerHTML = '';
};

let toggleMic = async (e) => {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        e.target.innerText = 'Mic on';
        e.target.style.backgroundColor = 'cadetblue';
    } else {
        await localTracks[0].setMuted(true);
        e.target.innerText = 'Mic off';
        e.target.style.backgroundColor = '#EE4B2B';
    }
};

let toggleCamera = async (e) => {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false);
        e.target.innerText = 'Camera on';
        e.target.style.backgroundColor = 'cadetblue';
    } else {
        await localTracks[1].setMuted(true);
        e.target.innerText = 'Camera off';
        e.target.style.backgroundColor = '#EE4B2B';
    }
};

document.getElementById('formid').addEventListener('submit', joinStream);
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);
