
// Progress Bar Animation
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');
const status = document.querySelector('.status');

const messages = [
    "Inizializzazione sistemi...",
    "Scansione porte...",
    "Crittografia connessione...",
    "Analisi firewall avversario...",
    "Caricamento toolkit hacking...",
    "Sincronizzazione nodi botnet...",
    "Preparazione attacco DDoS...",
    "Connessione al darkweb...",
    "Raccolta intelligenza artificiale...",
    "Matchmaking in corso..."
];

let progress = 0;
let stopProgress = false;
const interval = setInterval(() => {
    if(!stopProgress){
        progress += Math.random() * 10;
        if (progress > 98) progress = 98;

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;

        status.textContent = messages[Math.floor(progress / 10)];
    }
}, 500);

// Definisce la funzione checkGameStatus
function checkGameStatus() {
    // Utilizza fetch per fare una richiesta GET all'endpoint /check_game_status
    fetch('/check_game_status')
        .then(response => response.json()) // Analizza la risposta JSON
        .then(data => {
            // Se lo status nella risposta è 'starting'
            if (data.status === 'starting') {
                progressBar.style.width = `${100}%`;
                progressText.textContent = `${100}%`;
                status.textContent = "Avversario trovato, in attesa di inizio partita...";
                status.classList.add('blink');
                stopProgress = true;

                showPopup("Matchmaking concluso", "La partita sta per iniziare.",data.faction);
                // Reindirizza il browser all'URL /homepage_game_ seguito dalla faction dalla risposta
            } else {
                // Se lo status non è 'starting', imposta un timeout per chiamare nuovamente checkGameStatus dopo 1 secondo
                setTimeout(checkGameStatus, 1000);
            }
        });
}
function inizializedGame(){
    fetch('/inizialization_game')
        .then(response => response.json()) // Analizza la risposta JSON
        .then(data => {
            // Se lo status nella risposta è 'starting'
            if (data.status === 'success') {
                checkGameStatus();
            } else {
                // Se lo status non è 'starting', imposta un timeout per chiamare nuovamente checkGameStatus dopo 1 secondo
                setTimeout(checkGameStatus, 1000);
            }
        });
}
// Quando la finestra si carica, chiama checkGameStatus
window.onload = function() {
    inizializedGame();
};
function showPopup(title, description,faction) {

    var popup = document.getElementById("start-game");
    var h4 = document.createElement("h4");
    var p = document.createElement("p");
    var continueBtn = document.createElement("button");

    h4.innerHTML = title;

    p.innerHTML = description;
    continueBtn.innerHTML = "Continua";
    continueBtn.onclick = function() {
    if (faction === 'Alleati') {
        window.location.href = '/homepage_game_allies';
    } else if (faction === 'Asse') {
        window.location.href = '/homepage_game_axis';
    }
    };
    popup.append(h4);
    popup.append(p);
    popup.append(continueBtn);

    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById("infoPopup");
    if(popup.style.display == "block")
        popup.style.display = "none";
    var div = document.getElementById("infoPopup-2");
    if(div.style.display == "block")
        div.style.display = "none";
    var div = document.getElementById("new-game");
    if(div.style.display == "block")
        div.style.display = "none";
}
