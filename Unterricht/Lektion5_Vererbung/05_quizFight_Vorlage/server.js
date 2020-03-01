'use strict';

// Einbinden der benötigten Bibliotheken
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//eigene Klassen einbinden
const Player = require('./player');
const Message = require('./quizFight-client/js/message');
const RPSDuel = require('./rps-duel');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

//Array  in dem alle Spieler abgelegt sind
let lobby = [];

//Array in dem Herausforderungen gespeichert werden bevor der Gegner an nimmt und ein Spiel startet
let challenges = new Array();


//Auf Verbindungen von Clients reagieren
io.on('connection', connected);

//Client-App an anfragenden Client ausliefern
app.use(express.static(__dirname + '/quizFight-client'));
server.listen(8080, showReady);

function showReady() {
    console.log('Server connected!');
}

function connected(sock) {
    let msg = new Message('Server', 'Verbindung zum Server aufgebaut, Bitte anmelden.');
    //Start-Message "msg" zum verbundenen Client schicken.
    sock.emit('msg', JSON.stringify(msg));

    //Event-Listener der Messages an alle Clients weiter gibt
    sock.on('msg', (txt) => sendMessage(txt));

    //Event-Handler für sock definieren, der auf das Event "login" reagiert und die Funktion onLogin aufruft
    sock.on('login', (data) => onLogin(sock, data));

    //Event-Handler für sock, der auf einen "logout" durch den Client reagiert
    sock.on('logout', (p) => onLogout(p));

    //Event-Handler für sock definieren, der auf das Event "challenge" reagiert und die Funktion onChallenge aufruft und die Daten an die Funktion übergibt
    sock.on('challenge', (data) => onChallenge(data));
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
        if (lobby[i].name === p.name) {
            sock.emit('logout', 'Name bereits vorhanden. Bitte erneut einloggen!');
            return 0;
        }
    }
    //Objekt der Player-Klasse instanziieren und zur Lobby hinzufügen
    let player = new Player(sock, p);
    lobby.push(player);
    //Nach jedem Login wird der Highscore neu versendet
    broadcastHighscore();
}

//Bei einem Logout, Spieler aus der Lobby entfernen
function onLogout(p) {
    let player = JSON.parse(p);
    for (let i = 0; i < lobby.length; i++) {
        if (player.name === lobby[i].name) {
            lobby.splice(i, 1);
        }
    }
    broadcastHighscore();
}

//Versenden der Highscore-Liste als JSON-Objekt nach Sortierung
function broadcastHighscore() {
    let highscore = [];
    for (let i = 0; i < lobby.length; i++) {
        highscore.push({ name: lobby[i].name, score: lobby[i].score });
    }
    io.emit('highscore', JSON.stringify(highscore));
}

//Sendet Nachrichten an Clients
function sendMessage(data) {
    let msg = JSON.parse(data);
    for (let i = 0; i < lobby.length; i++) {
        if (msg.from === lobby[i].name) {
            io.emit('msg', data);
            return 0;
        }
    }
}

//Definiere die Funktion onChallenge, welche die übergebenen Daten prüft.
//Das Verhalten der Funktion wird in Hilfekarte 2 als Flussdiagramm beschrieben.
function onChallenge(data) {
    let turn = JSON.parse(data);
    let p1, p2 = null;
    //Instanz der Message Klasse erzeugen für Antwort
    let reply = new Message('Server', '');
    let chal = getChallenge(turn.player1, turn.player2, turn.game);

    //Suchen der Spieler anhand ihres Namens in der lobby
    for (let i = 0; i < lobby.length; i++) {
        if (turn.player1 === lobby[i].name) {
            p1 = lobby[i];
        } else if (turn.player2 === lobby[i].name) {
            p2 = lobby[i];
        }
    }

    if (p1 != null && p2 != null) { // Wenn die Spieler noch in der lobby sind
        if (!chal) {
            let rps = new RPSDuel(p1, p2);
            rps.makeTurn(turn.player1, turn.turn);
            challenges.push({
                player1: turn.player1,
                player2: turn.player2,
                game: rps
            });
            return 0;

        } else {
            //Schere-Stein-Papier Zug gemacht
            chal.game.makeTurn(turn.player1, turn.turn);
            challenges.splice(challenges.indexOf(chal), 1);
            //verteilen der neuen Highscore-Liste
            broadcastHighscore();
            return 0;
        }
    } else { //sonst wird eine Fehlermeldung zurückgegeben und abgebrochen
        reply.text = "Spieler nicht vorhanden. Herausforderung (" +
            turn.game + ":" +
            turn.player1 + " vs. " +
            turn.player2 + ") gescheitert.";
        challenges.splice(challenges.indexOf(chal), 1);
    }

    //Meldung zum Abbruch an den Spieler, der in der lobby ist
    if (p1 != null) {
        p1.socket.emit('msg', JSON.stringify(reply));
    }
    if (p2 != null) {
        p2.socket.emit('msg', JSON.stringify(reply));
    }
}

function getChallenge(p1, p2, game) {
    for (let i = 0; i < challenges.length; i++) {
        if (challenges[i].game.gametype === game) {
            if (challenges[i].player1 === p1 ||
                challenges[i].player2 === p1) {
                if (challenges[i].player2 === p2 ||
                    challenges[i].player1 === p2) {
                    return challenges[i];
                }
            }
        }
    }
    return null;
}