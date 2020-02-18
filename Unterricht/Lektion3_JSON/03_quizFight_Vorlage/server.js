'use strict';

// Einbinden der benötigten Bibliotheken
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

//Aufgabe 1 a.): Array anlegen, in dem alle Spieler abgelegt sind


//Auf Verbindungen von Clients reagieren
io.on('connection', connected);

//Client-App an anfragenden Client ausliefern
app.use(express.static(__dirname+'/quizFight-client'));
server.listen(8080, showReady);

function showReady(){
    console.log('Server connected!');
}

function connected(sock){
    //Start-Message "msg" zum verbundenen Client schicken.
    sock.emit('msg', 'Verbindung zum Server aufgebaut, Bitte anmelden.');

    //Event-Listener der Messages an alle Clients weiter gibt
    sock.on('msg', (txt) => io.emit('msg', txt));

    //Aufgabe 1 b.): Event-Handler für io definieren, der auf das Event "login" reagiert und die Funktion onLogin aufruft

}

//Fehlerbehandlung
server.on('error', serverError);
function serverError(err){
    console.error('Server error: ', err);
}

//Aufgabe 1 d.): onLogin Funktion implementieren nach einfacher Beschreibung mit Hilfe-Karte
function onLogin(sock, data){

    //Aufgabe 2 a.): Nach jedem Login wird der Highscore neu versendet

}

//Aufgabe 2 a.): Versenden der Highscore-Liste als JSON-Objekt nach Sortierung
function broadcastHighscore(){

}