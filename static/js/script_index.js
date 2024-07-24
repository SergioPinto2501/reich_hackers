document.getElementById('navigateAxis').addEventListener('click', function() {
    window.location.href = '/homepage_game_axis';
});
document.getElementById('navigateAllies').addEventListener('click', function() {
    window.location.href = '/homepage_game_allies';

});
function getDescriptions(event) {
    var clickedButton = event.target.id;
    var title = "";
    var description = "";
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
    showPopup(title, description);
}
function setFaction(event) {
    var faction = event.target.id;
    var title = "";
    if(faction == 'allies')
        title = "Alleati";
    else
        title = "Potenze dell'Asse";

    var descrizione = "Inserisci il tuo username per iniziare a giocare con la fazione " + title;
    insertUsername(title, descrizione,faction);
}
function insertUsername(Title, description, faction) {
    var div = document.getElementById("insert_username");
    var divButton = document.createElement("div");
    var h4 = document.createElement("h4");
    var p = document.createElement("p");
    var form = document.createElement("form");

    var input = document.createElement("input");
    var submit = document.createElement("button");
    var button = document.createElement("button");

    h4.innerHTML = Title;
    p.innerHTML = description;

    form.setAttribute("id", "form_username");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "/homepage_game");
    form.setAttribute("class", "form_username");


    input.setAttribute("type", "text");
    input.setAttribute("name", "username");
    input.setAttribute("id", "username");
    input.setAttribute("hint", "Username...");
    input.setAttribute("required", "true");
    input.setAttribute("placeholder", "Username...");
    input.setAttribute("style", "width: 100%;");

    submit.innerHTML = "Inizia a giocare";
    button.onclick = sendDataWithoutForm(faction);


    button.innerHTML = "Annulla";
    button.onclick = closePopup;

    divButton.setAttribute("class", "button-container-form");


    divButton.append(submit);
    divButton.append(button);
    form.append(input);
    form.append(divButton);

    div.append(h4);
    div.append(p);
    div.append(form);
    div.style.display = "block";

}
function showPopup(title, description) {
    var popup = document.getElementById("infoPopup");
    var h4 = document.createElement("h4");
    var p = document.createElement("p");
    var closeButton = document.createElement("button");

    h4.innerHTML = title;
    p.innerHTML = description;
    closeButton.innerHTML = "Chiudi";
    closeButton.onclick = closePopup;

    popup.innerHTML = "";
    popup.append(h4);
    popup.append(p);
    popup.append(closeButton);

    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById("infoPopup");
    if(popup.style.display == "block")
        popup.style.display = "none";
    var div = document.getElementById("insert_username");
    if(div.style.display == "block")
        div.style.display = "none";
}