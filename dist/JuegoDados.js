import { Jugador } from './Jugador.js';
import { Dado } from './Dados.js';
import { Jugada } from './Jugada.js';
export class JuegoDados {
    constructor(nombreJugador1, nombreJugador2) {
        this.jugador1 = new Jugador();
        this.jugador1.nombre = nombreJugador1;
        this.jugador2 = new Jugador();
        this.jugador2.nombre = nombreJugador2;
        this.cantidadJugadas = 0;
        this.marcadorJugador1 = 0;
        this.marcadorJugador2 = 0;
        this.dado1 = new Dado();
        this.dado2 = new Dado();
        this.bandJugador = false;
        this.vencedor = null;
    }
    elegirPrimerLanzador() {
        if (Math.floor(Math.random() * 2) + 1 === 1) {
            this.bandJugador = true;
        }
        else {
            this.bandJugador = false;
        }
    }
    iniciarJugada() {
        const jugadaActual = new Jugada();
        const jugadorActual = this.bandJugador ? this.jugador1 : this.jugador2;
        // Crear dados específicos para cada jugador
        const dadoJ1_1 = new Dado();
        const dadoJ1_2 = new Dado();
        const dadoJ2_1 = new Dado();
        const dadoJ2_2 = new Dado();
        // Preparar resultado
        let valorDado1J1, valorDado2J1, sumaJ1 = 0;
        let valorDado1J2, valorDado2J2, sumaJ2 = 0;
        // Cada jugador lanza sus propios dados
        sumaJ1 = this.jugador1.lanzaDados(dadoJ1_1, dadoJ1_2);
        valorDado1J1 = dadoJ1_1.puntos;
        valorDado2J1 = dadoJ1_2.puntos;
        sumaJ2 = this.jugador2.lanzaDados(dadoJ2_1, dadoJ2_2);
        valorDado1J2 = dadoJ2_1.puntos;
        valorDado2J2 = dadoJ2_2.puntos;
        // Ejecutamos la jugada para determinar quién gana puntos
        jugadaActual.iniciarJugada(this.jugador1, this.jugador2, dadoJ1_1, dadoJ1_2);
        // Guardamos los puntos ganados para retornarlos
        const puntoJ1 = this.jugador1.puntoGanado;
        const puntoJ2 = this.jugador2.puntoGanado;
        // Actualizamos los marcadores
        this.marcadorJugador1 += puntoJ1;
        this.marcadorJugador2 += puntoJ2;
        return {
            jugadorActual,
            valorDado1J1,
            valorDado2J1,
            valorDado1J2,
            valorDado2J2,
            sumaJ1,
            sumaJ2,
            puntoJ1,
            puntoJ2
        };
    }
    iniciarJuego(elementoActualizacion) {
        // Crear dados, inicializar variables
        this.dado1 = new Dado();
        this.dado2 = new Dado();
        this.cantidadJugadas = 0;
        this.marcadorJugador1 = 0;
        this.marcadorJugador2 = 0;
        this.elegirPrimerLanzador();
        //Ciclo infinito de juego
        do {
            const { jugadorActual, valorDado1J1, valorDado2J1, valorDado1J2, valorDado2J2, sumaJ1, sumaJ2, puntoJ1, puntoJ2 } = this.iniciarJugada();
            this.cantidadJugadas++;
            // Si se proporcionó un elemento HTML para mostrar actualizaciones
            if (elementoActualizacion) {
                // Crear contenedor para esta jugada
                const jugadaDiv = document.createElement('div');
                jugadaDiv.className = 'jugada-info';
                // Información de la jugada
                const infoJugada = document.createElement('div');
                infoJugada.innerHTML = `<span class="jugador-nombre">${jugadorActual.nombre}</span> lanza los dados (Jugada #${this.cantidadJugadas}):`;
                jugadaDiv.appendChild(infoJugada);
                // Mostrar dados del Jugador 1
                const dadosJ1Container = document.createElement('div');
                dadosJ1Container.className = 'dados-container';
                const jugador1Label = document.createElement('div');
                jugador1Label.innerHTML = `<span class="jugador-nombre">${this.jugador1.nombre}:</span> `;
                dadosJ1Container.appendChild(jugador1Label);
                dadosJ1Container.appendChild(window.crearDado(valorDado1J1));
                dadosJ1Container.appendChild(window.crearDado(valorDado2J1));
                const sumaDadosJ1 = document.createElement('span');
                sumaDadosJ1.textContent = ` = ${sumaJ1}`;
                if (sumaJ1 === 7) {
                    sumaDadosJ1.innerHTML += ` <span style="color: green; font-weight: bold;">(+1 punto)</span>`;
                }
                dadosJ1Container.appendChild(sumaDadosJ1);
                jugadaDiv.appendChild(dadosJ1Container);
                // Mostrar dados del Jugador 2
                const dadosJ2Container = document.createElement('div');
                dadosJ2Container.className = 'dados-container';
                const jugador2Label = document.createElement('div');
                jugador2Label.innerHTML = `<span class="jugador-nombre">${this.jugador2.nombre}:</span> `;
                dadosJ2Container.appendChild(jugador2Label);
                dadosJ2Container.appendChild(window.crearDado(valorDado1J2));
                dadosJ2Container.appendChild(window.crearDado(valorDado2J2));
                const sumaDadosJ2 = document.createElement('span');
                sumaDadosJ2.textContent = ` = ${sumaJ2}`;
                if (sumaJ2 === 7) {
                    sumaDadosJ2.innerHTML += ` <span style="color: green; font-weight: bold;">(+1 punto)</span>`;
                }
                dadosJ2Container.appendChild(sumaDadosJ2);
                jugadaDiv.appendChild(dadosJ2Container);
                // Puntaje actualizado
                const puntaje = document.createElement('div');
                puntaje.className = 'puntaje';
                puntaje.textContent = `Puntaje: ${this.jugador1.nombre} = ${this.marcadorJugador1} | ${this.jugador2.nombre} = ${this.marcadorJugador2}`;
                jugadaDiv.appendChild(puntaje);
                // Añadir toda la información al contenedor principal
                elementoActualizacion.appendChild(jugadaDiv);
            }
        } while ((this.marcadorJugador1 != 5) && (this.marcadorJugador2 != 5));
        //Determina ganador
        this.vencedor = this.determinarVencedor();
    }
    determinarVencedor() {
        //caso empate
        if ((this.marcadorJugador1 == 5) && (this.marcadorJugador2 == 5))
            return null;
        //ganó el jugador 1
        if (this.marcadorJugador1 == 5) {
            return this.jugador1;
        }
        else { //ganó el jugador 2
            if (this.marcadorJugador2 == 5) {
                return this.jugador2;
            }
        }
        return null;
    }
}
