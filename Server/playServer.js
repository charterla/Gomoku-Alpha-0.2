const express = require('express');
const SocketServer = require('ws').Server;
const hostname = '127.0.0.1';
const port = 3001;

const server = express().listen(port, () => console.log(`Listening on ${port}`));
const wss = new SocketServer({ server });

var room=new Array();
for(let i=0;i<=1000;i++){
    room[i]=['',''];
}

wss.on('connection', ws => {
    
    console.log('Client connected');

    ws.on('message', data => {
        let message=JSON.parse(data);
        console.log(message[0]);
        if(message[0]=='add'){
            console.log(message[1]);
            room[(message[1]-message[1]%10)/10][message[1]%10]=ws;
        }
        else if(message[0]=='interaction'){
            room[(message[1]-message[1]%10)/10][message[1]%10==1?0:1].send(JSON.stringify([message[2],message[3]]));
        }
    });

    ws.on('close', () => {
        console.log('Close connected')
    });
});