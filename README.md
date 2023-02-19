# ¡Bienvenido a 4 en Raya!

Este es un proyecto simple que intenta simular el juego de 4 en raya (o 4 en línea) en un entorno de un sitio web, hecho con HTML, CSS Y JavaScript, que corre en Node.js

# Cómo ejecutar el proyecto

## Clonar el proyecto

Crea una carpeta donde guardar el proyecto y ejecuta el comando
git clone https://github.com/fromant65/4-en-Raya.git

## Instalar paquetes

Necesitaremos tener instalado NPM. Una vez que tengamos esta herramienta, ejecutamos dentro de la carpeta del proyecto el siguiente comando
npm install
Esto instalará todas las dependencias del proyecto

## Correr el proyecto

Por ahora el proyecto está en fase de desarrollo. Para correrlos ejecutamos el comando
npm run dev
Y vamos a http://localhost:3500/

# Cómo jugar

Una vez que abrimos la página, veremos un tablero de 5\*7 casillas y un mensaje que indica el turno del jugador que corresponde
Para colocar una pieza, se debe hacer click en una casilla del tablero. Entonces la pieza caerá hasta el fondo de la columna de la casilla donde se hizo click (es decir, la ultima casilla no ocupada de arriba hacia abajo).
Luego de que el primer jugador terminó su turno, un segundo jugador en otra pestaña puede realizar su movimiento, y los turnos se alternarán entre ambos.
El primer jugador en colocar 4 piezas consecutivas del mismo color (en horizontal, vertical o diagonal) será el ganador. Cuando un jugador gane, se mostrará una leyenda en pantalla que lo indique
