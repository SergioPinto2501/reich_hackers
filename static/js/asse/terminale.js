
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

const toolOfPlayer = {};

async function fetchToolDescriptions() {
    const response = await fetch('/get_tools_list');
    const data = await response.json();
    const tools = data.tools;

    for (let toolName of tools) {
        const descriptionResponse = await fetch('/get_tool_description/' + toolName);
        const descriptionData = await descriptionResponse.json();
        toolOfPlayer[toolName] = descriptionData.description;
    }
}
window.onload = fetchToolDescriptions();

function handleTerminalInput(event) {
    if (event.key === 'Enter') {
        commandTyped = document.getElementById('terminal-input-field').value;

        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div><span class="prompt">$</span> ${commandTyped}</div>`;

        const commandParts = commandTyped.split(' ');
        const command = commandParts[0];
        let param = '';
        if(commandParts.length > 2){
            for (let i = 1; i < commandParts.length; i++){
                param += commandParts[i] + ' ';
            }
        }else
            param = commandParts[1];

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
            case 'vuln_scan':
                output.innerHTML += `<div>Errore nella sintassi...<br> Sintassi corretta: nmap vuln_scan indirizzo_ip</div>`;break;
            case 'nmap':
                if(toolOfPlayer.hasOwnProperty('nmap')){
                    if(param){
                        if (param.includes('vuln_scan')) {
                            const parts = param.split(' ');
                            const ipAddress = parts[1];
                            if(ipAddress)// Assuming the IP address is the second part
                                vulnScan(ipAddress);
                            else
                                output.innerHTML += `<div>Errore: inserire un indirizzo IP valido</div>`;
                        } else {
                            nmap(param);
                        }
                    }else
                        output.innerHTML += `<div>Errore: inserire un indirizzo IP valido</div>`;
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato nmap</div>`;
                break;
            case 'spiderfoot':
                if(toolOfPlayer.hasOwnProperty('spiderfoot')){
                    if(param)
                        output.innerHTML += `<div>Errore: Sintassi Errata... <br>Per entrare in spidefoot digita solamente 'spiderfoot'</div>`;
                    else
                        spiderfoot();
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato spiderfoot</div>`;

                break;
            case 'searchsploit':
                if(toolOfPlayer.hasOwnProperty('searchsploit')){
                    if(param)
                        searchsploit(param);
                    else
                        output.innerHTML += `<div>Errore:  inserisci la versione di un serivizio</div>`;
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato exploitDB</div>`;
                break;
            case 'shodan':
                if(toolOfPlayer.hasOwnProperty('shodan')){
                    if(param)
                        shodan(param);
                    else
                        output.innerHTML += `<div>Errore: inserire un indirizzo IP valido</div>`;
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato shodan</div>`;
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
    for (const [key, value] of Object.entries(toAdd)) {
        output.innerHTML += `<div>${key} - ${value}</div>`;
    }
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

                output.innerHTML += `<div>PORT&nbsp;STATE&nbsp;SERVICE</div>`;
                for (let i = 0; i < porte.length; i++) {
                    output.innerHTML += `<div>${porte[i]}&nbsp;open&nbsp;${servizi[i]}</div>`;
                }
                output.innerHTML += `<div>--------------------</div>`;
                output.innerHTML += `<br><div>Nmap done: 1 IP address scanned</div>`;
            }
        });

}
function vulnScan(indirizzo){
    let cont = 0;
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

                output.innerHTML += `<div>PORT&nbsp;STATE&nbsp;SERVICE</div>`;
                (async () => {
                    for (let i = 0; i < porte.length; i++) {
                        output.innerHTML += `<div>${porte[i]}&nbsp;open&nbsp;${servizi[i]}</div>`;
                        const response = await fetch("get_vulnerability_info/" + servizi[i]);
                        const data = await response.json();
                        if (data.vulnerability !== 'null') {
                            cont++;
                            output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.vulnerability.name}</div>`;
                            output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;State: VULNERABLE</div>`;
                            output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.vulnerability.description}</div>`;
                            output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CVE:}</div>`;
                            output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.vulnerability.cve}</div>`;
                            output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description: </div>`;
                            const maxLength = 80; // Maximum number of characters per line
                            const descriptionLines = data.vulnerability.cve_description.split('\n');
                            descriptionLines.forEach(line => {
                                let start = 0;
                                while (start < line.length) {
                                    let end = start + maxLength;
                                    if (end < line.length && line[end] !== ' ') {
                                        while (end > start && line[end] !== ' ') {
                                            end--;
                                        }
                                    }
                                    if (end === start) {
                                        end = start + maxLength;
                                    }
                                    const chunk = line.substring(start, end).trim();
                                    output.innerHTML += `<div>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${chunk}</div>`;
                                    start = end + 1;
                                }
                            });
                            output.innerHTML += `<div>| </div><br>`;
                        }
                    }
                    output.innerHTML += `<div>--------------------</div>`
                    output.innerHTML += `<br><div>Nmap done: 1 IP address scanned => Found ${cont} vulnerabilietis</div>`;
                })();

            }
        });
}
function spiderfoot(){
    clear();
    terminalCursor = document.getElementById('terminal_name');
    defaultTerminalCursor = terminalCursor.innerHTML;
    terminalCursor.innerHTML = "sp> ";
    const output = document.getElementById('terminal-output');
    output.innerHTML += `
        <div style="">
            <pre style="color: #ffcc00;">
    _________      .__    .___          ___________            __
     /   _____/_____ |__| __| _/__________\\_   _____/___   _____/  |_
     \\_____  \\\\____ \\|  |/ __ |/ __ \\_  __ \\    __)/  _ \\ /  _ \\   __\\
     /        \\  |_> >  / /_/ \\  ___/|  | \\/     \\(  <_> |  <_> )  |
    /_______  /   __/|__\\____ |\\___  >__|  \\___  / \\____/ \\____/|__|
            \\/|__|           \\/    \\/          \\/
                    Open Source Intelligence Automation.
                    by Steve Micallef | @spiderfoot
    
    [*] Version 4.0.0.
    [*] Loaded previous command history.
    [*] Type 'help' or '?'.
    [*] Type CTRL-C to exit.
            </pre>
        </div>
    `;
    document.getElementById('terminal-input-field').onkeypress = handleSpiderfootInput;

}
function handleSpiderfootInput(event){
    if (event.key === 'Enter') {
        commandTyped = document.getElementById('terminal-input-field').value;
        const output = document.getElementById('terminal-output');
        output.innerHTML += `<div><span class="prompt">sp></span> ${commandTyped}</div>`;

        const commandParts = commandTyped.split(' ');
        const command = commandParts[0];
        let param = '';
        if(commandParts.length > 2){
            for (let i = 1; i < commandParts.length; i++){
                param += commandParts[i] + ' ';
            }
        }else
            param = commandParts[1];

        switch (command) {
            case 'help':
                output.innerHTML += `<br><div>
    Command&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description <br> 
     ------------------+-------------------------------------------------------<br> 
     help [command]&nbsp;&nbsp;&nbsp;&nbsp;| This help output.<br> 
     scan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Inserisici un indirizzo ip per ottenere informazioni legati ad esso<br>                            
                </div>`;
                break;
            case 'scan':
                if(param){
                    output.innerHTML += `<div>Scanning for information...</div>`;
                    fetch("get_information_about_person/" + param)
                        .then(response => response.json())
                        .then(data => {
                            if(data.information !== 'null'){
                                output.innerHTML += `<div>&nbsp;&nbsp;&nbsp;[!] Informazion Found: </div>`;
                                output.innerHTML += `<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[*] Related Surname : ${data.information[0]}</div>`;
                                output.innerHTML += `<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[*] Related Name : ${data.information[1]}</div>`;
                                output.innerHTML += `<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[*] Related Email : ${data.information[2]}</div>`;

                            }else
                                output.innerHTML += `<div>[*] No data found</div>`;
                        });
                }else
                    output.innerHTML += `<div>Errore: inserire un indirizzo valido</div>`;
                break;

            case 'exit':
                clear();
                terminalCursor = document.getElementById('terminal_name');
                terminalCursor.innerHTML = defaultTerminalCursor;
                document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;
                break;
            default:
                output.innerHTML += `<div>Comando non riconosciuto. Digita “help” per visualizzare l'elenco dei comandi disponibili.</div>`;
                break;
        }
        document.getElementById('terminal-input-field').value = '';
        output.scrollTop = output.scrollHeight;
    }
}
function searchsploit(servizio){
    const output = document.getElementById('terminal-output');
    fetch("get_exploit_info/" + servizio)
        .then(response => response.json())
        .then(data => {
            if(data.exploits !== 'null'){
                exploits = data.exploits;
                console.log(exploits);
                output.innerHTML += `<div>--------------------------------------------------------------------------------</div>`;
                output.innerHTML += `<div><strong>Exploit Title | Path</strong> </div>`;
                output.innerHTML += `<div>--------------------------------------------------------------------------------</div>`;
                for (const [key, value] of Object.entries(exploits)) {
                    output.innerHTML += `<div>[-] ${key} | ${value}</div>`;
                }
                output.innerHTML += `<div>--------------------------------------------------------------------------------</div>`;
            }else
                output.innerHTML += `<div>Exploit not found</div>`;
        });
}
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'c') {
        if(document.getElementById('terminal').style.display !== 'none') {
            if (document.getElementById('terminal-input-field').onkeypress === handleSpiderfootInput) {
                clear();
                terminalCursor = document.getElementById('terminal_name');
                terminalCursor.innerHTML = defaultTerminalCursor;
                document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;
            }
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                const output = document.getElementById('terminal-output');
                output.innerHTML += `<div>Richiesta interrotta dall'utente</div><div>--------------------</div>`;
            }
        }
    }
});

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
}