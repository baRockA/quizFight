'use strict';

// Einbinden der benötigten Bibliotheken
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//Aufgabe 3 b.) einbinden der neuen Klasse

let app = express();
let server = http.createServer(app);
let io = socketio(server);

//Array  in dem alle Spieler abgelegt sind
let lobby = [];

// Aufgabe 3 c.) Array in dem Herausforderungen gespeichert werden bevor der Gegner an nimmt und ein Spiel startet

//Auf Verbindungen von Clients reagieren
io.on('connection', connected);

//Client-App an anfragenden Client ausliefern
app.use(express.static(__dirname + '/quizFight-client'));
server.listen(8080, showReady);

function showReady() {
    console.log('Server connected!');
}

function connected(sock) {
    //Start-Message "msg" zum verbundenen Client schicken.
    sock.emit('msg', JSON.stringify({ from: 'Server', text: 'Verbindung zum Server aufgebaut, Bitte anmelden.' }));

    //Event-Listener der Messages an alle Clients weiter gibt
    sock.on('msg', (txt) => sendMessage(txt));

    //Event-Handler für sock definieren, der auf das Event "login" reagiert und die Funktion onLogin aufruft
    sock.on('login', (data) => onLogin(sock, data));

    //Event-Handler für sock, der auf einen "logout" durch den Client reagiert
    sock.on('logout', (p) => onLogout(p));

    //Ausgabe 3 d.) Event-Handler für sock definieren, der auf das Event "challenge" reagiert und die Funktion onChallenge aufruft und die Daten an die Funktion übergibt

}

//Fehlerbehandlung
server.on('error', serverError);

function serverError(err) {
    console.error('Server error: ', err);
}

//onLogin Funktion implementieren nach einfacher Beschreibung mit Hilfe-Karte
function onLogin(sock, data) {
    let p = JSON.parse(data);
    for (let i = 0; i < lobby.length; i++) {
        if (lobby[i].player.name === p.name) {
            sock.emit('logout', 'Name bereits vorhanden. Bitte erneut einloggen!');
            return 0;
        }
    }

    lobby.push({ socket: sock, player: p });
    //Nach jedem Login wird der Highscore neu versendet
    broadcastHighscore();
}

//Bei einem Logout, Spieler aus der Lobby entfernen
function onLogout(p) {
    let player = JSON.parse(p);
    for (let i = 0; i < lobby.length; i++) {
        if (player.name === lobby[i].player.name) {
            lobby.splice(i, 1);
        }
    }
    broadcastHighscore();
}

//Versenden der Highscore-Liste als JSON-Objekt nach Sortierung
function broadcastHighscore() {
    let highscore = [];
    for (let i = 0; i < lobby.length; i++) {
        highscore.push({ name: lobby[i].player.name, score: lobby[i].player.score });
    }
    io.emit('highscore', JSON.stringify(highscore));
}

//Sendet Nachrichten an Clients
function sendMessage(data) {
    let msg = JSON.parse(data);
    for (let i = 0; i < lobby.length; i++) {
        if (msg.from === lobby[i].player.name) {
            io.emit('msg', data);
            return 0;
        }
    }
}

//Ausgabe 3 e.) Definiere die Funktion onChallenge, welche die übergebenen Daten prüft. Die Daten sind wie auf dem Aufgabenblatt beschrieben aufgebaut.
//      Das Verhalten der Funktion wird in Hilfekarte 2 als Flussdiagramm beschrieben.