'use strict';

//Player-Objekte instanziieren und initialisieren
let player = {name:"", email:"", score:0};

let sock = io();

sock.on('msg', onMessage);

//Aufgabe 1 f.): Auf ein Logout-Event vom Server reagieren und die Funktion onLogout aufrufen.

//Aufgabe 2 b.): Empfangen der Highscore-Liste und Aufruf der Ausgabefunktion

//Login Funktion wird beim betätigen des Login Buttons ausgeführt
// schreiben von Werten in Attribute und manipulieren des DOM
document.getElementById('button-login').addEventListener('click', onLogin);
function onLogin(event){
    //Standard-Operation (abschicken des Formulars) unterdrücken
    event.preventDefault();

    let name_value = document.getElementById('input-name').value;
    let mail_value = document.getElementById('input-mail').value;
    //Zusatz: Name und Mail muss ausgefüllt sein, sonst kein Login
    if (mail_value && name_value){
        //ausblenden des Login-Wrappers
        player.name = name_value;  
        document.getElementById('player-name').innerText = player.name;
        document.getElementById('login-wrapper').hidden = true;

        player.email = mail_value;

        //Aufgabe 1 e.): Senden des Playerobjekts als JSON an den Server

    } else {
        alert('Bitte E-Mail-Adresse und Name eingeben.');
    }
}

function onMessage(text){
    let list = document.getElementById('chat');
    let el = document.createElement('li');
    el.innerHTML = text;
    list.appendChild(el);
}

let form = document.getElementById('chat-form');
form.addEventListener('submit', sendMessage);

function sendMessage(ev){
    var input = document.getElementById('chat-input');
    var value = input.value;
    //Input-Feld leeren
    input.value = '';

    //Message über socket zum Server schicken
    sock.emit('msg', value);

    //Reload der Seite durch Browser vermeiden
    ev.preventDefault();
}

//Aufgabe 1 f.): Spieler wieder zurücksetzen, Login-Felder wieder anzeigen und Meldung des Servers ausgeben.

//Aufgabe 2 b.): Ausgabe der Highscore-Liste durch Listitems mit Spielername und Punktzahl
