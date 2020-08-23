let ws = new WebSocket('ws://127.0.0.1:3001');
let Board = document.getElementById("Board");
let context = Board.getContext("2d");
let roomNumber = sessionStorage.getItem('roomNumber');
let nowWay = 0, tag = new Array();

function check(x,y) {
    let rule=[[0,1],[1,0],[1,1],[1,-1]];
    for(let i=0;i<4;i++) {
        let ans=0;
        for(let j=1;j<5;j++) {
            let taX=rule[i][0]*j,taY=rule[i][1]*j,uW=true,uD=true;
            if(uW && x+taX>=0 && x+taX<15 && y+taY>=0 && y+taY<15 && tag[x+taX][y+taY]==nowWay)ans++;else uW = !uW;
            if(uD && x-taX>=0 && x-taX<15 && y-taY>=0 && y-taY<15 && tag[x-taX][y-taY]==nowWay)ans++;else uD = !uD;
        }
        if(ans>=4) {
            window.alert((nowWay==0)?"White's Player Win":"Black's Player Win");
            sessionStorage.removeItem('selfName');
            sessionStorage.removeItem('otherName');
            sessionStorage.removeItem('roomNumber');
            window.location.href='../index.html';
        }
    }
}

function drop(x,y) {
    context.beginPath();context.arc(x*50+25,y*50+25,20,0,Math.PI*2,true);context.fill();
    context.beginPath();context.arc(x*50+25,y*50+25,21,0,Math.PI*2,true);context.stroke();
    context.closePath();
}

function change() {
    let idChange = (nowWay==roomNumber%10)?['selfPlayer','otherPlayer']:['otherPlayer','selfPlayer'];
    document.getElementById(idChange[0]).className = "nowWay";
    document.getElementById(idChange[1]).className = "";
}

window.onload = function() {
    //console.log(roomNumber%10);
    let Player = ["Black's Player","White's Player"];
    document.getElementById('title').innerHTML = 'Gomoku - Game Room:'+ (roomNumber-roomNumber%10)/10;
    document.getElementById('otherPlayer').innerHTML = '<span id="Way">'+Player[roomNumber%10]+'</span><span> ('+sessionStorage.getItem('otherName')+')</span>';
    document.getElementById('selfPlayer').innerHTML = '<span id="Way">'+Player[roomNumber%10==0?1:0]+'</span><span> ('+sessionStorage.getItem('selfName')+')</span>';
    change();

    context.strokeStyle = '#808A87';
    context.lineWidth = '1';
	for(let i=0;i<15;i++){
        context.beginPath();context.moveTo(25,50*i+25);context.lineTo(725,50*i+25);context.stroke();
        context.beginPath();context.moveTo(50*i+25,25);context.lineTo(50*i+25,725);context.stroke();
    }context.closePath();

    for(let i=0;i<15;i++) {
        tag[i] = new Array();
        for(let j=0;j<15;j++) {
            tag[i][j] = 2;
        }
    }
}

ws.onopen = () => {
    //console.log('open connection');
    ws.send(JSON.stringify(['add',roomNumber]));
}

ws.onclose = () => {
    //console.log('close connection');
}

ws.onmessage = event => {
    let coordinate=JSON.parse(event['data']);
    let nowX=coordinate[0],nowY=coordinate[1];
    context.fillStyle = (nowWay==0)?'#FFFFFF':'#000000';
    context.strokeStyle = (nowWay==0)?'#000000':'#FFFFFF';

    tag[nowX][nowY]=nowWay;

    drop(nowX,nowY);check(nowX,nowY);

    nowWay = !nowWay;change();
}

Board.onmousedown = function(e) {
    if(nowWay==roomNumber%10) {
        let nowX=(e.offsetX-e.offsetX%50)/50,nowY=(e.offsetY-e.offsetY%50)/50;
        context.fillStyle = (nowWay==0)?'#FFFFFF':'#000000';
        context.strokeStyle = (nowWay==0)?'#000000':'#FFFFFF';
        
        if(tag[nowX][nowY]!=2)return;
        tag[nowX][nowY]=nowWay;

        drop(nowX,nowY);check(nowX,nowY);

        ws.send(JSON.stringify(['interaction',roomNumber,nowX,nowY]));
        nowWay = !nowWay;change();
    }
}
