const container = document.querySelector(".container-tablero");
const FILAS = 5;
const COLUMNAS = 7;
const MOVIMIENTOS=[];

const crearCasilla = (fila, columna)=>{
    const div = document.createElement('div');
    div.classList.add("casilla");
    div.id = `${fila}${columna}`;
    div.setAttribute('fila', `${fila}`)
    div.setAttribute('columna', `${columna}`);
    return div;
}

const crearTablero = (filas, columnas)=>{
    for (let fila = 0; fila < filas; fila++) {
        for(let columna = 0; columna < columnas; columna ++){
            let casilla = crearCasilla(fila, columna);
            container.appendChild(casilla);
        }
    }
}

crearTablero(FILAS,COLUMNAS);

const convertirFilaArray=(fila)=>{
    let fila_ = Array.from(document.querySelectorAll(`[fila='${fila}']`))
    return fila_;
}

const convertirTableroArray = (filas)=>{
    let tablero=[];
    for (let fila = 0; fila < filas; fila++) {
        tablero.push(convertirFilaArray(fila));
    }
    return tablero;
}

const tablero = convertirTableroArray(FILAS);

const agregarMovimiento = (casilla)=>{
    MOVIMIENTOS.push([parseInt(casilla[0]),parseInt(casilla[1])]);
    return;
}

const pintarCasillas = (casilla)=>{
    const filaJugada = document.querySelectorAll(`[fila='${casilla[0]}']`)
    const casillaJugada = filaJugada[casilla[1]];
    casillaJugada.style.background = MOVIMIENTOS.length%2==1?'#ff0000':'#0000ff';
    casillaJugada.setAttribute('jugador', `${MOVIMIENTOS.length%2==1?'1':'2'}`) 
}

const ponerPieza = (columna)=>{
    let columna_ = Array.from(document.querySelectorAll(`[columna='${columna}']`));
    for(let casilla=0;casilla<FILAS;casilla++){
        if(columna_[casilla].getAttribute('ocupada') !== '1' && casilla!=FILAS-1 ) continue
        if(casilla == FILAS-1 && columna_[casilla].getAttribute('ocupada') !== '1'){
            columna_[casilla].setAttribute('ocupada', '1');
            return [columna_[casilla].getAttribute('fila'),columna_[casilla].getAttribute('columna')];
        }
        columna_[casilla-1].setAttribute('ocupada', '1');
        return [columna_[casilla-1].getAttribute('fila'),columna_[casilla-1].getAttribute('columna')];
    }
}

const buscarMatchHorizontal = ()=>{
    for (let fila in tablero) {
        for (let columna in tablero[fila]) {
            if(columna<(COLUMNAS-3)){
                let casilla1= parseInt(tablero[fila][columna].getAttribute('jugador'));
                let casilla2= parseInt(tablero[fila][parseInt(columna)+1].getAttribute('jugador'));
                let casilla3= parseInt(tablero[fila][parseInt(columna)+2].getAttribute('jugador'));
                let casilla4= parseInt(tablero[fila][parseInt(columna)+3].getAttribute('jugador'));
                if(casilla1 &&
                casilla1===casilla2 && 
                casilla1===casilla3 &&
                casilla1===casilla4){
                    return tablero[fila][columna].getAttribute('jugador'); 
                }   
            } 
        }
    }
}

const buscarMatchVertical = ()=>{
    for (let fila in tablero) {
        for (let columna in tablero[fila]) {
            if(fila<(FILAS-3)){
                let casilla1= parseInt(tablero[fila][columna].getAttribute('jugador'));
                let casilla2= parseInt(tablero[parseInt(fila)+1][columna].getAttribute('jugador'));
                let casilla3= parseInt(tablero[parseInt(fila)+2][columna].getAttribute('jugador'));
                let casilla4= parseInt(tablero[parseInt(fila)+3][columna].getAttribute('jugador'));
                if(casilla1 &&
                casilla1===casilla2 && 
                casilla1===casilla3 &&
                casilla1===casilla4){
                    return tablero[fila][columna].getAttribute('jugador'); 
                }
            }  
        }
    }
}

const buscarMatchDiagonal= ()=>{
    for (let fila in tablero) {
        for (let columna in tablero[fila]) {
            if(fila<(FILAS-3) && columna<(COLUMNAS-3)){
                let casilla1= parseInt(tablero[fila][columna].getAttribute('jugador'));
                let casilla2= parseInt(tablero[parseInt(fila)+1][parseInt(columna)+1].getAttribute('jugador'));
                let casilla3= parseInt(tablero[parseInt(fila)+2][parseInt(columna)+2].getAttribute('jugador'));
                let casilla4= parseInt(tablero[parseInt(fila)+3][parseInt(columna)+3].getAttribute('jugador'));
                if(casilla1 &&
                casilla1===casilla2 && 
                casilla1===casilla3 &&
                casilla1===casilla4){
                    return tablero[fila][columna].getAttribute('jugador'); 
                }
            }  
        }
    }
    for (let fila in tablero) {
        for (let columna in tablero[fila]) {
            if(fila>2 && columna<(COLUMNAS-3)){
                let casilla1= parseInt(tablero[fila][columna].getAttribute('jugador'));
                let casilla2= parseInt(tablero[parseInt(fila)-1][parseInt(columna)+1].getAttribute('jugador'));
                let casilla3= parseInt(tablero[parseInt(fila)-2][parseInt(columna)+2].getAttribute('jugador'));
                let casilla4= parseInt(tablero[parseInt(fila)-3][parseInt(columna)+3].getAttribute('jugador'));
                if(casilla1 &&
                casilla1===casilla2 && 
                casilla1===casilla3 &&
                casilla1===casilla4){
                    return tablero[fila][columna].getAttribute('jugador'); 
                }
            }  
        }
    }
}

const determinarGanador = ()=>{
    if(buscarMatchHorizontal()) return buscarMatchHorizontal();
    if(buscarMatchVertical()) return buscarMatchVertical();
    if(buscarMatchDiagonal()) return buscarMatchDiagonal();
}

const crearCartelGanador = (ganador)=>{
    const cartelGanador = document.querySelector('.cartel-ganador');
    cartelGanador.innerHTML = `El ganador es el jugador ${ganador}`;
    cartelGanador.style.color = "#44ee44";
    cartelGanador.style.padding = "20px";
    cartelGanador.style.fontSize = "30px";
}

const killEventListeners = ()=>{
    for (let fila = 0; fila < FILAS; fila++) {
        for(let columna = 0; columna < COLUMNAS; columna ++){
            let casilla = tablero[fila][columna];
            casilla.removeEventListener('click', juego)
        }
    }
}

const terminarJuego = ()=>{
    let ganador = determinarGanador();
    if(!ganador) return;
    crearCartelGanador(ganador);
    killEventListeners();
}

const juego = (e)=>{
    let fila = e.currentTarget.getAttribute('fila')
    let columna = e.currentTarget.getAttribute('columna')
    let casilla = tablero[fila][columna];
    let casillaJugada = ponerPieza(casilla.getAttribute('columna'));
    agregarMovimiento(casillaJugada);
    pintarCasillas(casillaJugada);
    terminarJuego();
}

const crearEventListeners = (filas,columnas)=>{
    for (let fila = 0; fila < filas; fila++) {
        for(let columna = 0; columna < columnas; columna ++){
            tablero[fila][columna].addEventListener('click', juego)
        }
    }
}
crearEventListeners(FILAS, COLUMNAS);