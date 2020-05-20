let ws = new WebSocket('ws://127.0.0.1:3000');
let otherPlayer,name;

window.onload = function() {
    if(window.navigator.userAgent.indexOf("Chrome") == -1) {
        window.alert("請使用Google Chrome瀏覽器");
    }
}

ws.onopen = () => {
    //console.log('open connection');
}

ws.onclose = () => {
    //console.log('close connection');
}

ws.onmessage = event => {
    otherPlayer=JSON.parse(event['data']);
    sessionStorage.setItem('selfName',name);
    sessionStorage.setItem('otherName',otherPlayer[1]);
    sessionStorage.setItem('roomNumber',otherPlayer[0]);
    window.location.href='../chessBoard/chessBoard.html';
}

function waitRoom(){
    name=document.getElementById("nickname").value;
    if(name!="")ws.send(document.getElementById("nickname").value);
    //console.log(name);
    document.getElementById("type").innerHTML= "<p>waiting to match</p>";
}