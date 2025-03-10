import { JuegoDados } from './JuegoDados';

// Capturar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length != 2) {
    console.log("Debes enviar 2 nombres para los jugadores");
    process.exit(1);
}

console.log("Primer Jugador: " + args[0]);
console.log("Segundo Jugador: " + args[1]);

// Crear juego con los nombres recibidos por línea de comandos
const juego = new JuegoDados(args[0], args[1]);

juego.iniciarJuego();

if (juego.vencedor == null)
    console.log("Empate. No hay un vencedor ");
else
    console.log("El vencedor es: " + juego.vencedor.nombre);