
document.getElementById('my_computer').onclick = openTerminal;
document.querySelector('.terminal-controls .close').onclick = closeTerminal;
document.querySelector('.terminal-controls .minimize').onclick = closeTerminal;
document.querySelector('.terminal-controls .maximize').onclick = closeTerminal;
document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;

// Aggiungi un messaggio di benvenuto quando il terminale viene aperto
document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('terminal-output');
    output.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <pre style="color: #ffcc00;">
             _    _ _ _          _   _____                                          _
            / \\  | | (_) ___  __| | / ____|___  _ __ ___  _ __ ___   __ _ _ __   __| |
           / _ \\ | | | |/ _ \\/ _\` || |   / _ \\| '_ \` _ \\| '_ \` _ \\ / _\` | '_ \\ / _\` |
          / ___ \\| | | |  __/ (_| || |__| (_) | | | | | | | | | | | (_| | | | | (_| |
         /_/   \\_\\_|_|_|\\___|\\__,_| \\____\\___/|_| |_| |_|_| |_| |_|\\__,_|_| |_|\\__,_|
        
                    </pre>
                </div>
                <div>Benvenuti nel terminale degli Alleati. Digita il comando “help” per ottenere un elenco dei comandi disponibili.</div>
                <div>--------------------</div>
            `;
});


function openTerminal() {
    document.getElementById('terminal').style.display = 'block';
    document.getElementById('terminal-input-field').focus();
}

function closeTerminal() {
    document.getElementById('terminal').style.display = 'none';
}

function handleTerminalInput(event) {
    if (event.key === 'Enter') {
        commandTyped = document.getElementById('terminal-input-field').value;

        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div><span class="prompt">$</span> ${commandTyped}</div>`;
        if (commandTyped === 'help') {
            help();
        } else if (commandTyped === 'clear') {
            clear();
        }else if (commandTyped.substring(0,4) === 'ping') {
            ipTyped = commandTyped.substring(5);
            ping(ipTyped);
        }else{
            output.innerHTML += `<div>Comando non riconosciuto. Digita “help” per visualizzare l'elenco dei comandi disponibili.</div>`;
        }

        // Qui puoi aggiungere la logica per processare i comandi
        document.getElementById('terminal-input-field').value = '';

        // Scorri automaticamente verso il basso
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
            output.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                    <pre style="color: #ffcc00;">
             _    _ _ _          _   _____                                          _
            / \\  | | (_) ___  __| | / ____|___  _ __ ___  _ __ ___   __ _ _ __   __| |
           / _ \\ | | | |/ _ \\/ _\` || |   / _ \\| '_ \` _ \\| '_ \` _ \\ / _\` | '_ \\ / _\` |
          / ___ \\| | | |  __/ (_| || |__| (_) | | | | | | | | | | | (_| | | | | (_| |
         /_/   \\_\\_|_|_|\\___|\\__,_| \\____\\___/|_| |_| |_|_| |_| |_|\\__,_|_| |_|\\__,_|
        
                    </pre>
                </div>
                    <div>Benvenuti nel terminale degli Alleati. Digita il comando “help” per ottenere un elenco dei comandi disponibili.</div>
                    <div>--------------------</div>
                `;
}


let intervalId;

function ping(indirizzo) {
    const output = document.getElementById('terminal-output');
    output.innerHTML += `<div>--------------------</div>`;
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
    if (event.ctrlKey && event.key === 'z') {
        clearInterval(intervalId);
        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div>Richiesta interrotta dall'utente</div><div>--------------------</div>`;
    }
});