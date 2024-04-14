// Javascript
// Note that to avoid browser-compatibility issues, this sample uses the import command to import the SDK and the vite to package the JS file.
// import AC from 'agora-chat'


let APP_ID='611123436#1307446'
let localStream;
let remoteStream;
let peerConnection;

let tokenid='007eJxTYCgPbHnuzHnt2pb8D1esrQS3bWoz7zApuK2y/rRUTK7kouUKDKZGBgbGSWmJiSlGSSaGRsmJiYmplkkWFmmW5maGxmbmCtdY0hoCGRkeZ89gYGRgBWImBhCfgQEAoQYdwQ==';
let uid='123456';

let client;
let channel;


const server={
 iceServers:[
   {
     urls:['stun:stun1.l.google.com:19302',
       'stun:stun2.l.google.com:19302']
   }
 ]
}
let init= async ()=>{
     // Get access to the user's camera and microphone
     client=await new WebIM.connection({appKey:APP_ID})
     await client.open({user:uid,token:tokenid})

     channel = client.createChannel('main')

     await channel.join()


     channel.on('MemberJoined',handleUserJoined)

 localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
     // Set the local media stream as the source for a video element with id 'user-1'

 document.getElementById('user-1').srcObject = localStream 
 createOffer();

}


let handleUserJoined=(MemberId)=>{
  console.log('A new user joined the channel:',MemberId)
}

let createOffer= async ()=>{
     // Create a new RTCPeerConnection object
 peerConnection = new RTCPeerConnection(server)
 // Create a new MediaStream object

 remoteStream = new MediaStream()
 

 localStream.getTracks().forEach((track)=>{
  console.log('hello')
   peerConnection.addTrack(track,localStream)
 })

peerConnection.ontrack=(event)=>{
  console.log('hellohi')
 event.streams[0].getTracks().forEach((track)=>{
   remoteStream.addTrack(track)
 }
 )
}
document.getElementById('user-2').srcObject = remoteStream

peerConnection.onicecandidate=(event)=>{
 if(event.candidate){
   console.log('New ICE Cndidate:',event.candidate);
 }
}

 let offer= await peerConnection.createOffer();
 peerConnection.setLocalDescription(offer);


 console.log("offer:",offer)


}
init()