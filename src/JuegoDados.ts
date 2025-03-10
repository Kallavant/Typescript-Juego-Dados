import { Jugador } from './Jugador';
import { Dado } from './Dados';
import { Jugada } from './Jugada';

declare global {
    interface Window {
        crearDado: (valor: number) => HTMLElement;
    }
}

export class JuegoDados {
    cantidadJugadas: number;
    jugador1: Jugador;
    jugador2: Jugador;
    marcadorJugador1: number;
    marcadorJugador2: number;
    dado1: Dado;
    dado2: Dado;
    vencedor: Jugador | null;
    private bandJugador: boolean;  //true = Jugador1, false = Jugador2

    constructor(nombreJugador1: string, nombreJugador2: string) {
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

    public elegirPrimerLanzador(): void {
        if (Math.floor(Math.random() * 2) + 1 === 1) {
            this.bandJugador = true;
        }
        else {
            this.bandJugador = false;
        }
    }

    public iniciarJugada(): { jugadorActual: Jugador, valorDado1: number, valorDado2: number } {
        const jugadaActual = new Jugada();
        const jugadorActual = this.bandJugador ? this.jugador1 : this.jugador2;

        if (this.bandJugador) {
            jugadaActual.iniciarJugada(this.jugador1, this.jugador2,
                this.dado1, this.dado2);
        }
        else {
            jugadaActual.iniciarJugada(this.jugador2, this.jugador1,
                this.dado1, this.dado2);
        }

        this.marcadorJugador1 = this.marcadorJugador1 + this.jugador1.puntoGanado;
        this.marcadorJugador2 = this.marcadorJugador2 + this.jugador2.puntoGanado;

        // Obtener los valores de los dados usando la propiedad 'puntos'
        const valorDado1 = this.dado1.puntos;
        const valorDado2 = this.dado2.puntos;

        return {
            jugadorActual,
            valorDado1,
            valorDado2
        };
    }

    public iniciarJuego(elementoActualizacion?: HTMLElement): void {
        // Crear dados, inicializar variables
        this.dado1 = new Dado();
        this.dado2 = new Dado();

        this.cantidadJugadas = 0;
        this.marcadorJugador1 = 0;
        this.marcadorJugador2 = 0;

        this.elegirPrimerLanzador();

        //Ciclo infinito de juego
        do {
            const { jugadorActual, valorDado1, valorDado2 } = this.iniciarJugada();

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
                
                // Contenedor para los dados
                const dadosContainer = document.createElement('div');
                dadosContainer.className = 'dados-container';
                
                // Añadir dados visuales
                dadosContainer.appendChild(window.crearDado(valorDado1));
                dadosContainer.appendChild(window.crearDado(valorDado2));
                jugadaDiv.appendChild(dadosContainer);
                
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
    
    public determinarVencedor(): Jugador | null {
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