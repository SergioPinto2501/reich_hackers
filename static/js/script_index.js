
document.getElementById('start').addEventListener('click', function() {
    window.location.href = '/login_player';
});


 // Add JavaScript to handle the click event
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            $('#rulesCarousel').carousel($(targetElement).index());
        }
    });
});

function getDescriptions(event) {
    var clickedButton = event.target.id;
    var title = "";
    var description = "";
    var popupName = "infoPopup";
    switch (clickedButton) {
        case "rec":
            title = "Ricognizione";
            description = "Esplora la rete avversaria per identificare nodi e vulnerabilità visibili. Alcuni nodi chiave potrebbero essere esposti, consentendoti di iniziare a pianificare le tue mosse successive.";
            break;
        case "wea":
            title = "Armamento";
            description = "Selezionare gli strumenti e le tecniche da utilizzare per l'attacco, come malware, exploit o tecniche di ingegneria sociale.";
            break;
        case "del":
            title = "Delivery";
            description = "Trasmetti e consegna il prodotto della fase di “Weaponization”, ad esempio inviando un'e-mail di phishing o creando un sito web fasullo.";
            break;
        case "exp":
            title = "Exploitation";
            description = "Sfrutta le vulnerabilità identificate durante la fase di Ricognizione per ottenere l'accesso alla rete avversaria.";
            break;
        case "ins":
            title = "Installation";
            description = "Installa il malware o gli strumenti sul nodo compometto per ottenere il controllo.";
            break;
        case  "com":
            title = "Comand & Control";
            description = "Stabilisci una connessione stabile il nodo compromesso per controllarlo e inviare ulteriori istruzioni.";
            break;
        case "act":
            title = "Action On Objectives";
            description = "Esegui azioni specifiche per raggiungere i tuoi obiettivi, come rubare dati, interrompere i servizi o danneggiare l'infrastruttura.";
            break;

    }
    showPopup(title, description,popupName);
}

function showPopup(title, description,popupName,faction) {
    event.preventDefault();
    var popup = document.getElementById(popupName);
    var h4 = document.createElement("h4");
    var p = document.createElement("p");
    var closeButton = document.createElement("button");
    var newGame = document.createElement("button");

    h4.innerHTML = title;


    p.innerHTML = description;
    closeButton.innerHTML = "Chiudi";
    closeButton.onclick = closePopup;
    newGame.innerHTML = "Nuova Partita";
    newGame.onclick = createGame;

    popup.innerHTML = "";
    popup.append(h4);
    popup.append(p);
    popup.append(closeButton);
    if(popupName == "new-game") {
        if(faction == "axis") {
            newGame.id = "axis";
        }else
            newGame.id = "allies";

        popup.append(newGame);
    }

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
function deleteContent(event,type) {
    event.preventDefault()
    if(type == 'registration') {
        var username = document.getElementById("username");
        username.value = "";
        var password = document.getElementById("password");
        password.value = "";
        var confirmPassword = document.getElementById("confirm_password");
        confirmPassword.value = "";
        var email = document.getElementById("email");
        email.value = "";
        var name = document.getElementById("name");
        name.value = "";
        var surname = document.getElementById("surname");
        surname.value = "";
    }
    if(type == 'login') {
        var password = document.getElementById("password");
        password.value = "";
        var email = document.getElementById("email");
        email.value = "";
    }

}

function createGame(event) {
    var faction = event.target.id;
    console.log(faction)
    if(faction == "axis") {
        window.location.href = '/create_game?side=axis';
    }
    if(faction == "allies") {
        window.location.href = '/create_game?side=allies';
    }
}