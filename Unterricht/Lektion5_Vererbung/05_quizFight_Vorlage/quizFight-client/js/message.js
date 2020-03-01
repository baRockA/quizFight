//Klasse für Nachrichten
class Message {
    constructor(s, t) {
        this.from = s;
        this.text = t;
    }
}

//Bei Verwendung auf Client braucht mein keinen Modul export, bei Verwendung auf Server schon
if (typeof(module) != 'undefined') {
    module.exports = Message;
}