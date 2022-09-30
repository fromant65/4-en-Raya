const container = document.querySelector(".container-tablero");
const FILAS = 5;
const COLUMNAS = 7;
const MOVIMIENTOS=[];

const crearCasilla = (fila, columna)=>{
    /*
    Para crear una casilla necesitaremos:
        -Un div donde almacenarla
        -El div tendrá la clase casilla por cuestiones de CSS
        -El div tendra una ID que será su fila y columna concatenadas en un string
    */
    const div = document.createElement('div');
    div.classList.add("casilla");
    div.id = `${fila}${columna}`;
    div.setAttribute('fila', `${fila}`)
    div.setAttribute('columna', `${columna}`);
    return div;
}

const crearTablero = (filas, columnas)=>{
    /*
    El tablero será un grid de casillas que manejaremos con CSS
    */
    for (let fila = 0; fila < filas; fila++) {
        for(let columna = 0; columna < columnas; columna ++){
            let casilla = crearCasilla(fila, columna);
            container.appendChild(casilla);
        }
    }
}

crearTablero(FILAS,COLUMNAS);

const convertirFilaArray=(fila)=>{
    //Obtenemos un numero de fila y creamos un array que contenga todas las casillas en dicha fila
    let fila_ = Array.from(document.querySelectorAll(`[fila='${fila}']`))
    return fila_;
}

const convertirTableroArray = (filas)=>{
    //Obtenemos un array de filas y las guardamos en una variable que sea el tablero
    let tablero=[];
    for (let fila = 0; fila < filas; fila++) {
        tablero.push(convertirFilaArray(fila));
    }
    return tablero;
}

const tablero = convertirTableroArray(FILAS);

const agregarMovimiento = (casilla)=>{
    //Si no ha llegado ningun movimiento (casilla), retornamos sin hacer nada
    if(!casilla) return

    //En caso de que haya llegado un movimiento, lo agregamos
    MOVIMIENTOS.push([parseInt(casilla[0]),parseInt(casilla[1])]);
    return;
}

const pintarCasillas = (casilla)=>{
    //Si no ha llegado ningun movimiento (casilla), retornamos sin hacer nada
    if(!casilla) return

    //En caso de que haya un movimiento, pintamos la casilla del color correspondiente
    const filaJugada = document.querySelectorAll(`[fila='${casilla[0]}']`)
    const casillaJugada = filaJugada[casilla[1]];
    //Si la cantidad de movimientos es impar, será el turno del jugador 1, sino del jugador 2
    casillaJugada.style.background = MOVIMIENTOS.length%2==1?'#ff0000':'#0000ff';
    casillaJugada.setAttribute('jugador', `${MOVIMIENTOS.length%2==1?'1':'2'}`) 
}

const determinarTurno = ()=>{
    //Si la cantidad de movimientos es impar
    //Esa cantidad +1 es par, por lo que el siguiente turno es del j2, sino del j1
    let turno = (MOVIMIENTOS.length+1)%2==1?'1 (rojo)':'2 (azul)';
    //Luego mostramos el turno en un div
    const h2Turno = document.querySelector('.turno');
    h2Turno.innerHTML = `Turno de Jugador ${turno}`;
}

const eliminarTurno = ()=>{
    //Cuando haya un ganador, ya no será el turno de nadie, 
    //asi que ocultamos el div
    const h2Turno = document.querySelector('.turno');
    h2Turno.innerHTML = '';
    h2Turno.style.visibility = 'hidden';
    h2Turno.style.position = 'absolute'
}

const ponerPieza = (columna)=>{
    //Creamos un array de casillas de la columna donde se detectó un movimiento
    let columna_ = Array.from(document.querySelectorAll(`[columna='${columna}']`));
    for(let casilla=0;casilla<FILAS;casilla++){
        //Si la casilla de la iteración actual no esta ocupada 
        //y aun no llegamos al fondo del tablero, continuamos
        if(columna_[casilla].getAttribute('ocupada') !== '1' && casilla!=FILAS-1 ) continue

        //Si la casilla esta ocupada y es la última
        //Seteamos el atributo 'ocupada' de la misma a '1'
        //Y retornamos la fila y columna de la casilla
        if(casilla == FILAS-1 && columna_[casilla].getAttribute('ocupada') !== '1'){
            columna_[casilla].setAttribute('ocupada', '1');
            return [columna_[casilla].getAttribute('fila'),columna_[casilla].getAttribute('columna')];
        }

        //Si la casilla superior de la columna esta ocupada,
        //Debemos retornar sin hacer nada
        if(parseInt(columna_[0].getAttribute('ocupada'))===1) return;

        //En caso de que nada de lo anterior suceda, 
        //significa que hemos llegado a una casilla ocupada que no está
        //en la última fila y que la columna no está completamente ocupada
        //por lo que decimos que la casilla anterior debe estar ocupada tambien
        //con una ficha; ponemos la ficha en la casilla superior siguiente
        //y devolvemos dicha casilla
        columna_[casilla-1].setAttribute('ocupada', '1');
        return [columna_[casilla-1].getAttribute('fila'),columna_[casilla-1].getAttribute('columna')];
    }
}

const buscarMatchHorizontal = ()=>{
    //Verificamos para todo el tablero que no haya 4 casillas seguidas horizontales del mismo color
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
    //Verificamos para todo el tablero que no haya 4 casillas seguidas verticales del mismo color
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
    //Verificamos para todo el tablero que no haya 4 casillas seguidas diagonales del mismo color
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
    //Llamamos a las funciones declaradas anteriormente para determinar,
    //en caso de que haya 4 casillas seguidas del mismo color,
    //quién es el ganador
    if(buscarMatchHorizontal()) return buscarMatchHorizontal();
    if(buscarMatchVertical()) return buscarMatchVertical();
    if(buscarMatchDiagonal()) return buscarMatchDiagonal();
}

const crearCartelGanador = (ganador)=>{
    //Mostramos un cartel con el ganador del juego si lo hay
    const cartelGanador = document.querySelector('.cartel-ganador');
    cartelGanador.innerHTML = `El ganador es el jugador ${ganador}`;
    cartelGanador.style.color = parseInt(ganador)%2==1?"#ff0000":"#0000ff";
    cartelGanador.style.padding = "20px";
    cartelGanador.style.fontSize = "30px";
}

const killEventListeners = ()=>{
    //Esta funcion remueve todos los event listeners de cada casilla
    for (let fila = 0; fila < FILAS; fila++) {
        for(let columna = 0; columna < COLUMNAS; columna ++){
            let casilla = tablero[fila][columna];
            casilla.removeEventListener('click', juego)
        }
    }
}

const terminarJuego = ()=>{
    //Determinamos si hay un ganador
    let ganador = determinarGanador();

    //Si no lo hay, retornamos
    if(!ganador) return;

    //Si lo hay, mostramos el cartel ganador y eliminamos 
    //todos los event listeners para que no se pueda jugar más
    crearCartelGanador(ganador);
    eliminarTurno();
    killEventListeners();
}

const juego = (e)=>{
    //Esta funcion representa el ciclo del juego y recibe un evento 
    //(el cual es el event listener de cada casilla)
    //Guardamos la fila y columna de la casilla que recibimos en el evento en una variable
    let fila = e.currentTarget.getAttribute('fila')
    let columna = e.currentTarget.getAttribute('columna')
    let casilla = tablero[fila][columna];
    //Luego, ponemos una pieza en la columna casilla jugada si es posible
    let casillaJugada = ponerPieza(casilla.getAttribute('columna'));
    agregarMovimiento(casillaJugada);
    pintarCasillas(casillaJugada);
    //Determinamos si el juego debe terminar o no (si ya hay un ganador)
    terminarJuego();
    determinarTurno();
}

const crearEventListeners = (filas,columnas)=>{
    //Creamos un event listener para cada casilla del tablero
    for (let fila = 0; fila < filas; fila++) {
        for(let columna = 0; columna < columnas; columna ++){
            tablero[fila][columna].addEventListener('click', juego)
        }
    }
}
crearEventListeners(FILAS, COLUMNAS);