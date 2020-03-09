'use strict';

//Player-Objekte instanziieren und initialisieren
let player = { name: "", email: "", score: 0 };
let sock = io();
sock.on('msg', onMessage);

//Auf ein Logout-Event vom Server reagieren und die Funktion onLogout aufrufen.
sock.on('logout', onLogout);

//Empfangen der Highscore-Liste und Aufruf der Ausgabefunktion
sock.on('highscore', showHighscore);

//Auf challenge-Events reagieren
sock.on('challenge', onChallenge);

//Definition der Event-Listener der Benutzerschnittstelle
document.getElementById('button-login').addEventListener('click', onLogin);

//Logout-Wrapper zu Beginn ausblenden
document.getElementById('logout-wrapper').hidden = true;

let form = document.getElementById('chat-form');
form.addEventListener('submit', sendMessage);

//Auf click des Logout-Buttons oder das schließen des Fensters reagieren
window.addEventListener('beforeunload', logoutPlayer);
document.getElementById('button-logout').addEventListener('click', logoutPlayer);

//Variable für den herausgeforderten Spieler im Modal-Menu
let challengedPlayer = "";

//Lektion 5 ZUsatz: Änderung für RPSLS und neue EventListener
//EventListeners für Stein-Schere-Papier-Buttons
document.getElementById('rps-rock').addEventListener('click', sendRPSTurn);
document.getElementById('rps-paper').addEventListener('click', sendRPSTurn);
document.getElementById('rps-scissors').addEventListener('click', sendRPSTurn);
document.getElementById('rpsls-rock').addEventListener('click', sendRPSTurn);
document.getElementById('rpsls-paper').addEventListener('click', sendRPSTurn);
document.getElementById('rpsls-scissors').addEventListener('click', sendRPSTurn);
document.getElementById('rpsls-lizard').addEventListener('click', sendRPSTurn);
document.getElementById('rpsls-spock').addEventListener('click', sendRPSTurn);

document.getElementById('quizchallenge-button').addEventListener('click', startQuiz);
document.getElementById('quiz-wrapper').hidden = true;

//Login Funktion wird beim betätigen des Login Buttons ausgeführt
// schreiben von Werten in Attribute und manipulieren des DOM
function onLogin(event) {
    //Standard-Operation (abschicken des Formulars) unterdrücken
    event.preventDefault();

    let name_value = document.getElementById('input-name').value;
    let mail_value = document.getElementById('input-mail').value;
    //Name und Mail muss ausgefüllt sein, sonst kein Login
    if (mail_value && name_value) {
        //ausblenden des Login-Wrappers
        player.name = name_value;
        document.getElementById('player-name').innerText = player.name;
        document.getElementById('login-wrapper').hidden = true;
        document.getElementById('logout-wrapper').hidden = false;
        player.email = mail_value;

        //Senden des Playerobjekts als JSON an den Server
        sock.emit('login', JSON.stringify(player));
    } else {
        alert('Bitte E-Mail-Adresse und Name eingeben.');
    }
}

function onMessage(jsonmsg) {
    let msg = JSON.parse(jsonmsg);
    let list = document.getElementById('chat');
    let el = document.createElement('li');
    el.innerHTML = msg.from + ": " + msg.text;
    list.appendChild(el);
}

function sendMessage(ev) {
    var input = document.getElementById('chat-input');
    var value = input.value;

    //Input-Feld leeren
    input.value = '';

    //Message Klasse beim Client einbinden und instanziieren
    //Message über socket zum Server schicken
    let msg = new Message(player.name, value);
    sock.emit('msg', JSON.stringify(msg));

    //Reload der Seite durch Browser vermeiden
    ev.preventDefault();
}

//Spieler wieder zurücksetzen, Login-Felder wieder anzeigen und Meldung des Servers ausgeben.
function onLogout(msg) {
    player.name = "";
    player.email = "";
    player.score = 0;
    document.getElementById('login-wrapper').hidden = false;
    document.getElementById('logout-wrapper').hidden = true;
    alert(msg);
}

//Ausgabe der Highscore-Liste durch Listitems mit Spielername und Punktzahl
function showHighscore(data) {
    let highscore = JSON.parse(data);
    let list = document.getElementById('highscore');
    list.innerHTML = "";
    for (let i = 0; i < highscore.length; i++) {
        let el = document.createElement('li');
        el.innerHTML = highscore[i].name + ": " + highscore[i].score;

        //Fehlerbehebung aus Lektion 4
        el.setAttribute("id", highscore[i].name);

        //eigenen Spieler im Highscore hervorheben
        if (highscore[i].name !== player.name) {
            //Erweiterung des Highscores zur Herausforderung eines Spielers bzw. zum annehmen einer Herausforderung.
            el.setAttribute("data-toggle", "modal");
            el.setAttribute("data-target", "#challengeMenu");
            el.addEventListener('click', onChallengePlayer);
        } else {
            //Fehlerbehebung aus Lektion 4
            el.setAttribute("class", "myScore");
        }

        list.appendChild(el);
    }
}

//Logout durch den Client.
function logoutPlayer(event) {
    //"logout"-Event mit Player-Objekt als Inhalt an Server schicken
    sock.emit('logout', JSON.stringify(player));
    onLogout("Abgemeldet. Bis zum nächsten mal!");
}

//Anpassen der Überschrift im Modal und Auswahl des herausgeforderten Spielers mit Anzeige auf der Seite
function onChallengePlayer(event) {
    challengedPlayer = event.target.id;
    document.getElementById('challengedPlayerName').innerText = challengedPlayer;
}

//Funktion um einen Zug an den Server zu schicken
function sendRPSTurn(event) {
    if (challengedPlayer && challengedPlayer !== player.name) {
        //Lektion 5 Zusatz: Änderung für RPSLS mit String split() in ein Array aufteilen
        let idStr = event.target.id.split("-");
        let myturn = { player1: player.name, player2: challengedPlayer, turn: idStr[1], game: idStr[0] };
        sock.emit('challenge', JSON.stringify(myturn));
    }
    //Ausblenden des modalen Dialogs von Bootstrap nach Auswahl (jQuery)
    $('#challengeMenu').modal('hide');
}

// auf challenge-Event vom Server reagieren
function onChallenge(data) {
    let msg = JSON.parse(data);
    switch (msg.status) {
        case 0:
            document.getElementById(msg.player1).innerHTML += '<span class="badge badge-pill badge-primary float-right">' + msg.game + '</span>';
            //Lektion 5 Aufgabe 3 c.) Erweiterung für Quiz
            if (msg.game === 'quiz') {
                let quest = JSON.parse(msg.text);
                document.getElementById('quizchallenge-button').hidden = true;
                document.getElementById('quiz-wrapper').hidden = false;
                document.getElementById('question').innerText = quest.text;
                for (let i = 0; i < quest.answers.length; i++) {
                    document.getElementById('answer' + i).innerText = quest.answers[i];
                    document.getElementById('answer' + i).addEventListener('click', sendQuizTurn);
                }
            }
            break;
        case 1:
            //Markierung entfernen
            let pli = document.getElementById(msg.player1);
            if (pli.firstElementChild) {
                pli.removeChild(pli.firstElementChild);
            }
            break;
        case 2:
            if (player.name === msg.player1) {
                challengedPlayer = msg.player2;
            } else {
                challengedPlayer = msg.player1;
            }
            document.getElementById('challengedPlayerName').innerText = challengedPlayer;
            //Lektion 5 Zusatzaufgabe
            addGameListElement(msg.game + ": Gegen " + challengedPlayer + " " + msg.text);

            //Lektion 5 Aufgabe 3 c.) Erweiterung für Quiz
            if (msg.game === 'quiz') {
                document.getElementById('quizchallenge-button').hidden = false;
                document.getElementById('quiz-wrapper').hidden = true;
            }
            break;
    }
}

//Lektion 5 Aufgabe 3 b.) Nachricht an Server mit Herausforderung
function startQuiz(event) {
    let myturn = { player1: player.name, player2: challengedPlayer, turn: null, game: "quiz" };
    sock.emit('challenge', JSON.stringify(myturn));
}

//Lektion 5 Aufgabe 3 d.) 
function sendQuizTurn(event) {
    let myturn = { player1: player.name, player2: challengedPlayer, turn: null, game: "quiz" };
    switch (event.target.id) {
        case 'answer0':
            myturn.turn = 0;
            break;
        case 'answer1':
            myturn.turn = 1;
            break;
        case 'answer2':
            myturn.turn = 2;
            break;
        case 'answer3':
            myturn.turn = 3;
            break;
    }
    sock.emit('challenge', JSON.stringify(myturn));
    $('#challengeMenu').modal('hide');
}

//Lektion 5 Zusatzaufgabe
function addGameListElement(text) {
    let gList = document.getElementById('gamemsg');
    let gEl = document.createElement('li');
    gEl.innerHTML = text;
    gList.appendChild(gEl);
}