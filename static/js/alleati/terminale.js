
document.getElementById('my_computer').onclick = openTerminal;
document.querySelector('.terminal-controls .close').onclick = closeTerminal;
document.querySelector('.terminal-controls .minimize').onclick = minimizeTerminal;
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
function minimizeTerminal() {
    document.getElementById('terminal').style.display = 'none';

}

function closeTerminal() {
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
    document.getElementById('terminal').style.display = 'none';
}

const toolOfPlayer = [];
fetch('/get_tools_list')
    .then(response => response.json())
    .then(data => {
        let toAdd = '';
        for (let i = 0; i < data.tools.length; i++) {
            toolOfPlayer.push(data.tools[i]);
        }
    });

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
                help(toolOfPlayer);
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
            case 'nmap':
                if(toolOfPlayer.includes('nmap')){
                    if(param)
                        nmap(param);
                    else
                        output.innerHTML += `<div>Errore: inserire un indirizzo IP valido</div>`;
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato nmap</div>`;
                break;
            default:
                output.innerHTML += `<div>Comando non riconosciuto. Digita “help” per visualizzare l'elenco dei comandi disponibili.</div>`;
                break;
        }
        document.getElementById('terminal-input-field').value = '';
        output.scrollTop = output.scrollHeight;
    }
}
function help(toAdd) {
    const output = document.getElementById('terminal-output');
    output.innerHTML += `
        <div>--------------------</div>
        <div>Comandi disponibili:</div>
        <div>help - Mostra l'elenco dei comandi disponibili</div>
        <div>clear - Pulisce il terminale</div>
        <div>ping - Controlla la connessione</div>
    `;
    output.innerHTML += toAdd;
    output.innerHTML += `<div>--------------------</div>`;
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
                if (data.status === "online") {
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
function nmap(indirizzo){
    const dataTime = getCurrentDateTime();
    const output = document.getElementById('terminal-output');
    output.innerHTML += `<div>--------------------</div>`;
    output.innerHTML += `<div>Premi Ctrl + c per interrompere l'esecuzione del comando</div>`;
    output.innerHTML += `<div>Starting Nmap ${indirizzo} at ${dataTime}...</div>`;
    fetch("get_node_info/" + indirizzo)
        .then(response => response.json())
        .then(data => {
            if(data.node === 'null'){
                output.innerHTML += `<div>Host non raggiungibile</div>`;
                output.innerHTML += `<div>--------------------</div>`;
            }else {
                output.innerHTML += `<br><div>Stato: ${data.node.status}</div>`;
                output.innerHTML += `<div>Nome: ${data.node.name}</div>`;
                output.innerHTML += `<div>Indirizzo IP: ${data.node.ip}</div>`;
                output.innerHTML += `<div>OS: ${data.node.os}</div>`;
                output.innerHTML += `<br><div>Interesting port on ${indirizzo}...</div>`;
                let services = {};
                if (data.node.services.startsWith('{') && data.node.services.endsWith('}')) {
                    const pairs = data.node.services.slice(1, -1).split(', ');
                    for (const pair of pairs) {
                        const [key, value] = pair.split(': ');
                        services[parseInt(key)] = value.slice(1, -1); // Rimuovi le virgolette
                    }
                }
                // Convert the services object into a string
                let porte = [];
                let servizi = [];
                Object.entries(services).forEach(([port, service]) => {
                    porte.push(port);
                    servizi.push(service);
                });
                console.log(porte);
                console.log(servizi);
                output.innerHTML += `<div>PORT&nbsp;STATE&nbsp;SERVICE</div>`;
                for (let i = 0; i < porte.length; i++) {
                    output.innerHTML += `<div>${porte[i]}&nbsp;open&nbsp;${servizi[i]}</div>`;
                }
                output.innerHTML += `<div>--------------------</div>`;
            }
        });

}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'c') {
        clearInterval(intervalId);
        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div>Richiesta interrotta dall'utente</div><div>--------------------</div>`;
    }
});
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
}