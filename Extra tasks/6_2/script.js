let x = new Array(9);

function zero() {
    let id = Math.floor(Math.random() * 9);
    if(x[id]){
        return zero();
    }else{
        return move(id, 'zero');
    }
}

function checkEnd() {
    if ( x[0]=='zero' && x[1]=='zero' && x[2]=='zero' || x[3]=='zero' && x[4]=='zero' && x[5]=='zero' || x[6]=='zero' && x[7]=='zero' && x[8]=='zero' || x[0]=='zero' && x[3]=='zero' && x[6]=='zero' || x[1]=='zero' && x[4]=='zero' && x[7]=='zero' || x[2]=='zero' && x[5]=='zero' && x[8]=='zero'|| x[0]=='zero' && x[4]=='zero' && x[8]=='zero' || x[2]=='zero' && x[4]=='zero' && x[6]=='zero'){
        alert('Победили нолики!');
        return true;
        
    }
    if ( x[0]=='player' && x[1]=='player' && x[2]=='player' || x[3]=='player' && x[4]=='player' && x[5]=='player' || x[6]=='player' && x[7]=='player' && x[8]=='player' || x[0]=='player' && x[3]=='player' && x[6]=='player' || x[1]=='player' && x[4]=='player' && x[7]=='player' || x[2]=='player' && x[5]=='player' && x[8]=='player' || x[0]=='player' && x[4]=='player' && x[8]=='player' || x[2]=='player' && x[4]=='player' && x[6]=='player' ) {
        alert('Вы победили!');
        return true;
        
    }
    if ( x[0] && x[1] && x[2] && x[3] && x[4] && x[5] && x[6] && x[7] && x[8] ){
        alert('Ничья!');
        return true;
    } 
}

function move(id, role) {
    if(x[id]){
        return false;
    }
    x[id] = role;
    document.getElementById(id).className = 'box ' + role;
    !checkEnd() ? (role == 'player') ? zero() : null : reset();
}

function reset() {
    alert('Игра окончена!');
    location.reload();
}