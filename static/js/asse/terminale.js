
document.getElementById('my_computer').onclick = openTerminal;
document.querySelector('.terminal-controls .close').onclick = closeTerminal;
document.querySelector('.terminal-controls .minimize').onclick = minimizeTerminal;
document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;

// Aggiungi un messaggio di benvenuto quando il terminale viene aperto
document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('terminal-output');
    output.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
                            <pre style="color: #ff4500;">
                         _____     _                         _____                                          _ 
                        |  _  |_ _|_|___    _____ ___ _ _ ___|     |___ _ _ _ ___ ___    ___ ___ _____ ___| |
                        |     | | | |_ -|  |  _  | . | | | -_|   --| . | | | | .'|   |  |  _| . |     | .'| |
                        |__|__|_  |_|___|  |   __|___|___|___|_____|___|_____|__,|_|_|  |_| |___|_|_|_|__,|_|
                              |___|        |__|                                                                
                            </pre>
        </div>
        <div>Benvenuti nel terminale delle Potenze dell'Asse. Digita il comando “help” per ottenere un elenco dei comandi disponibili.</div>
        <div>--------------------</div>
    `;
});


function openTerminal() {
    document.getElementById('terminal').style.display = 'block';
    document.getElementById('terminal-input-field').focus();
}

function minimizeTerminal() {
    document.getElementById('terminal').style.display = 'none';

}

function closeTerminal() {
    const output = document.getElementById('terminal-output');
    output.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
                            <pre style="color: #ff4500;">
                         _____     _                         _____                                          _ 
                        |  _  |_ _|_|___    _____ ___ _ _ ___|     |___ _ _ _ ___ ___    ___ ___ _____ ___| |
                        |     | | | |_ -|  |  _  | . | | | -_|   --| . | | | | .'|   |  |  _| . |     | .'| |
                        |__|__|_  |_|___|  |   __|___|___|___|_____|___|_____|__,|_|_|  |_| |___|_|_|_|__,|_|
                              |___|        |__|                                                                
                            </pre>
        </div>
        <div>Benvenuti nel terminale delle Potenze dell'Asse. Digita il comando “help” per ottenere un elenco dei comandi disponibili.</div>
        <div>--------------------</div>
    `;
    document.getElementById('terminal').style.display = 'none';
}

function handleTerminalInput(event) {
    if (event.key === 'Enter') {
        commandTyped = document.getElementById('terminal-input-field').value;

        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div><span class="prompt">$</span> ${commandTyped}</div>`;

        const commandParts = commandTyped.split(' ');
        const command = commandParts[0];
        const param = commandParts[1];

        switch (command) {
            case 'help':
                help();
                break;
            case 'clear':
                clear();
                break;
            case 'ping':
                if (param) {
                    ping(param);
                } else {
                    output.innerHTML += `<div>Errore: inserire un indirizzo IP valido</div>`;
                }
                break;
            case 'exit':
                closeTerminal();
                break;
            default:
                output.innerHTML += `<div>Comando non riconosciuto. Digita “help” per visualizzare l'elenco dei comandi disponibili.</div>`;
                break;
        }
        document.getElementById('terminal-input-field').value = '';
        output.scrollTop = output.scrollHeight;
    }
}
function help(){
    const output = document.getElementById('terminal-output');
    output.innerHTML += `
        <div>--------------------</div>
        <div>Comandi disponibili:</div>
        <div>help - Mostra l'elenco dei comandi disponibili</div>
        <div>clear - Pulisce il terminale</div>
        <div>ping - Controlla la connessione</div>
        <div>--------------------</div>
        `;
}
function clear(){
    const output = document.getElementById('terminal-output');
            output.innerHTML = ``;
}

let intervalId;

function ping(indirizzo) {
    const output = document.getElementById('terminal-output');
    output.innerHTML += `<div>--------------------</div>`;
    output.innerHTML += `<div>Premi Ctrl + c per interrompere l'esecuzione del comando</div>`;
    output.innerHTML += `<div>Esecuzione di Ping ${indirizzo} con 32 byte di dati:</div>`;
    intervalId = setInterval(() => {
        fetch("get_node_status/" + indirizzo)
            .then(response => response.json())
            .then(data => {
                if (data.status == "online") {
                    output.innerHTML += `
                <div> Risposta da ${indirizzo} byte=32 durata=4ms TTL=64</div>
                `;
                } else {
                    output.innerHTML += `
                <div>Risposta da ${indirizzo}: Host di destinazione non raggiungibile.</div>
                `;
                }
            });
    }, 1000);
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'c') {
        clearInterval(intervalId);
        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div>Richiesta interrotta dall'utente</div><div>--------------------</div>`;
    }
});