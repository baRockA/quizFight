'use strict';

//Player-Objekte instanziieren und initialisieren
let player = {name:"", email:"", score:0};

//Aufgabe 3: Chat Client

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
    } else {
        alert('Bitte E-Mail-Adresse und Name eingeben.');
    }

}

