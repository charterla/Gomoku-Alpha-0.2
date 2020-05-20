const express = require('express');
const SocketServer = require('ws').Server;
const hostname = '127.0.0.1';
const port = 3000;

const server = express().listen(port, () => console.log(`Listening on ${port}`));
const wss = new SocketServer({ server });

var nickname=new Array(),member=0,number=0;

wss.on('connection', ws => {
    
    console.log('Client connected');

    ws.on('message', data => {
        nickname[member]=new Array();
        nickname[member][0]=data;
        nickname[member++][1]=ws;
        console.log(nickname[member-1][0]," ",member-1);

        if(member>1){
            console.log('have');
            nickname[0][1].send(JSON.stringify([number*10+1,nickname[1][0]]));
            nickname[1][1].send(JSON.stringify([number*10+0,nickname[0][0]]));
            member=0;
            number==1000?number=0:number++;
        }
    });

    ws.on('close', () => {
        for(let i=0;i<member;i++){
            if(ws==nickname[i][1]){
                for(let j=i+1;j<member;j++){
                    nickname[j-1]=nickname[j];
                }
                member--;
            }
        }

        console.log('Close connected')
    });
});