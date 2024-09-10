
const toolOfPlayer = {};
defaultTerminalCursor = document.getElementById('terminal_name').innerHTML;
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
            case 'setoolkit':
                if(toolOfPlayer.hasOwnProperty('setoolkit')){
                    if(param)
                        output.innerHTML += `<div>Errore: Sintassi Errata... <br>Per utilizzare il Social-Engineer Toolkit digita solamente 'setoolkit'</div>`;
                    else
                        setoolkit();
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato setoolkit</div>`;
                break;
            case 'msfdb':
                if(toolOfPlayer.hasOwnProperty('msfdb')){
                    if(param)
                        if(param === 'run' || param === 'start')
                            metasploit();
                        else
                            output.innerHTML += `<div>Errore: Sintassi Errata... <br>Per utilizzare metasploit digita 'msfdb run' o 'msftp start'</div>`;
                    else
                        output.innerHTML += `<div>Errore: Sintassi Errata... <br>Per utilizzare metasploit digita 'msfdb run' o 'msftp start'</div>`;
                }else
                    output.innerHTML += `<div>Errore: non hai acquistato metasploit</div>`;
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
    terminalCursor.innerHTML = "sp> ";
    terminalCursor.style.color = "#ffcc00";

    const output = document.getElementById('terminal-output');
    output.style.color = "#ffcc00";

    inputField = document.getElementById('terminal-input-field');
    inputField.style.color = "#ffcc00";

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
        prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.innerHTML = 'sp>';
        prompt.style.color = "#ffcc00";

        output.innerHTML += prompt.innerHTML + ' ' + commandTyped + '<br>';

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
                terminalCursor.style.color = "#33ff33";

                terminalInput = document.getElementById('terminal-input-field');
                terminalInput.style.color = "#33ff33";

                output.style.color = "#33ff33";

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

headerSetoolkit = `<div style="">
            <pre style="color: #ffcc00;">
    [---]        The Social-Engineer Toolkit (SET)         [---]
    [---]        Created by: David Kennedy (ReL1K)         [---]
                          Version: 8.0.3
                        Codename: 'Maverick'
    [---]        Follow us on Twitter: @TrustedSec         [---]
    [---]        Follow me on Twitter: @HackingDave        [---]
    [---]       Homepage: https://www.trustedsec.com       [---]
            Welcome to the Social-Engineer Toolkit (SET).
             The one stop shop for all of your SE needs.
    
       The Social-Engineer Toolkit is a product of TrustedSec.
    
               Visit: https://www.trustedsec.com
    
       It's easy to update using the PenTesters Framework! (PTF)
    Visit https://github.com/trustedsec/ptf to update all your tools!
    
    </pre></div>`;


function setoolkit(){
    clear();
    terminalCursor = document.getElementById('terminal_name');
    terminalCursor.innerHTML = "set> ";
    terminalCursor.style.color = "#ffcc00";

    const output = document.getElementById('terminal-output');
    output.style.color = "#ffcc00";

    inputField = document.getElementById('terminal-input-field');
    inputField.style.color = "#ffcc00";
    output.innerHTML += headerSetoolkit;
    output.innerHTML += `
        <div style="">
            <pre style="color: #ffcc00;">
    
     Select from the menu:
       1) Social-Engineering Attacks
       4) Update the Social-Engineer Toolkit
       5) Update SET configuration
    
       99) Exit the Social-Engineer Toolkit
            </pre>
            </div>
        `;
    document.getElementById('terminal-input-field').onkeypress = handleSetoolkitInput;
}

function handleSetoolkitInput(event){
    let i= 1;
    if (event.key === 'Enter') {
        commandTyped = document.getElementById('terminal-input-field').value;
        const output = document.getElementById('terminal-output');

        prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.innerHTML = 'set> ';
        prompt.style.color = "#ffcc00";

        output.innerHTML += prompt.innerHTML + ' ' + commandTyped + '<br>';

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
            case '1':
                clear();
                output.innerHTML += headerSetoolkit;
                output.innerHTML += `
                <div>
                <pre style="color: #ffcc00;">
    Select from the menu:      
      10) Spear-Phishing Attack Vectors
                   
      0) Return back to the main menu.
                </pre>
                </div>`;break;
            case '10':
                clear();
                output.innerHTML += headerSetoolkit;
                output.innerHTML += `
                <div>
                <pre style="color: #ffcc00;">
    Il modulo <strong>Spearphishing</strong> consente di creare messaggi di posta elettronica ad hoc e 
    di inviarli a un numero elevato (o ridotto) di persone con allegati file in formato nocivo.    
                
    Scegliere tra le seguenti opzioni:
     20) Perform a Mass Email Attack (max 3 emails)
     21) Perform a Single Email Attack
     0) Return back to the main menu.           
                </pre>
                </div>`;
                break;
            case '20':
                clear();
                document.getElementById('terminal-input-field').innerHTML = '';
                startMassEmailAttack();
                break;
            case '21':
                clear();
                document.getElementById('terminal-input-field').innerHTML = '';
                startEmailAttack();
                break;
            case '4':
                clear();
                output.innerHTML += headerSetoolkit;
                output.innerHTML += `<div>Updating the Social-Engineer Toolkit...</div>`;
                showDownloadSetoolkit()
                break;
            case '5':
                clear();
                output.innerHTML += headerSetoolkit;
                output.innerHTML += `<div>Updating SET configuration...</div>`;
                showDownloadSetoolkit();
                break;
            case '0':
                clear();
                output.innerHTML += headerSetoolkit;
                output.innerHTML += `
                <div>
                <pre style="color: #ffcc00;">
    Select from the menu:          
     1) Social-Engineering Attacks
     4) Update the Social-Engineer Toolkit
     5) Update SET configuration
                                
     99) Exit the Social-Engineer Toolkit
                </pre>
                </div>`;
                break;

            case '99':
                clear();
                terminalCursor = document.getElementById('terminal_name');
                terminalCursor.innerHTML = defaultTerminalCursor;
                terminalCursor.style.color = "#33ff33";
                terminalInput = document.getElementById('terminal-input-field');
                terminalInput.style.color = "#33ff33";
                output.style.color = "#33ff33";
                document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;
                break;
            case '':
                clear();
                output.innerHTML += headerSetoolkit;
                output.innerHTML += `
        <div style="">
            <pre style="color: #ffcc00;">
    
     Select from the menu:
       1) Social-Engineering Attacks
       4) Update the Social-Engineer Toolkit
       5) Update SET configuration
    
       99) Exit the Social-Engineer Toolkit
            </pre>
            </div>
        `;break;

            default: output.innerHTML += `<div>Comando non riconosciuto. </div>`;
        }
        document.getElementById('terminal-input-field').value = '';
        output.scrollTop = output.scrollHeight;
    }
}

let emailSender = "", numeroEmail = 0, email = [], subject = "", body = "";


function startMassEmailAttack(){
    clear();
    output = document.getElementById('terminal-output');
    output.innerHTML += `<div>Mass Email Attack</div>`;
    output.innerHTML += `<div>----------------------</div>`;
    output.innerHTML += `<div>Insert sender E-mail: </div>`;
    document.getElementById('terminal-input-field').onkeypress = handleEmailSenderInputForMassAttack;
}
function startEmailAttack(){
    clear();
    output = document.getElementById('terminal-output');
    output.innerHTML += `<div>Single Email Attack</div>`;
    output.innerHTML += `<div>----------------------</div>`;
    output.innerHTML += `<div>Insert sender E-mail: </div>`;
    document.getElementById('terminal-input-field').onkeypress = handleEmailSenderInputForSingleAttack;
}
function handleEmailSenderInputForMassAttack(){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        document.getElementById('terminal-input-field').value = '';
        emailSender = commandTyped;
        output.innerHTML += `<div>[+] Sender E-mail: ${commandTyped}</div>`;
        output = document.getElementById('terminal-output');
        output.innerHTML += `<div>Insert number of emails: </div>`
        document.getElementById('terminal-input-field').onkeypress = handleNumberEmailForAttack;
    }

}
function handleEmailSenderInputForSingleAttack(){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        document.getElementById('terminal-input-field').value = '';
        emailSender = commandTyped;
        output.innerHTML += `<div>[+] Sender E-mail: ${commandTyped}</div>`;
        output.innerHTML += `<div>Insert email: </div>`
        console.log(emailSender);
        numeroEmail = 1;
        document.getElementById('terminal-input-field').onkeypress = handleEmailInput;
    }
}
function handleNumberEmailForAttack(event){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        document.getElementById('terminal-input-field').value = '';
        numeroEmail = commandTyped;
        output.innerHTML += `<div>[+] Number of emails: ${commandTyped}</div>`;
        if(numeroEmail > 3){
            output.innerHTML += `<div>[!] Mass Email Attack support only 3 emails</div>`;
            output.innerHTML += `<div>Insert number of emails: </div>`
            document.getElementById('terminal-input-field').onkeypress = handleNumberEmailForAttack;
        }else{
            document.getElementById('terminal-input-field').onkeypress = handleEmailInput;
            output.innerHTML += `<div>Insert email: </div>`;
        }
    }
}
var index=0;
function handleEmailInput(event){
    if(event.key === 'Enter') {
        console.log(numeroEmail);
        numeroEmail--;
        if (numeroEmail >= 0) {
            console.log(numeroEmail);
            commandTyped = document.getElementById('terminal-input-field').value;
            document.getElementById('terminal-input-field').value = '';
            email[index] = commandTyped;
            output.innerHTML += `<div>[+] Email ${index}: ${email[index]}</div>`;
            index++;
            output.innerHTML += `<div>Insert email : </div>`;
            if(numeroEmail === 0){
                output.removeChild(output.lastChild);
                output.innerHTML += `<div>Insert subject: </div>`;
                document.getElementById('terminal-input-field').onkeypress = handleSubjectInput;
                numeroEmail = i+1;
            }
        }
    }
}
function handleSubjectInput(event){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        document.getElementById('terminal-input-field').value = '';
        subject = commandTyped;
        output.innerHTML += `<div>[+] Subject: ${subject}</div>`;
        output.innerHTML += `<div>Insert body: </div>`;
        document.getElementById('terminal-input-field').onkeypress = handleBodyInput;
    }
}
function handleBodyInput(event){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        document.getElementById('terminal-input-field').value = '';
        body = commandTyped;
        console.log(emailSender, numeroEmail, email, subject, body);
        output.innerHTML += `<div>[+] Body: ${body}</div>`;
        output.innerHTML += `<br><div>--------RECAP---------</div>`;
        output.innerHTML += `<div>Mass Email Attack</div>`;
        output.innerHTML += `<div>----------------------</div>`;
        output.innerHTML += `<div>Sender E-mail: ${emailSender}</div>`;
        output.innerHTML += `<div>Number of emails: ${numeroEmail}</div>`;
        output.innerHTML += `<div>Victim Emails: </div>`;
        for(let i=0; i<email.length; i++){
            output.innerHTML += `<div>[-] ${email[i]}</div>`;
        }
        output.innerHTML += `<div>Subject: ${subject}</div>`;
        output.innerHTML += `<div>Body: ${body}</div>`;
        output.innerHTML += `<div>----------------------</div>`;
        output.innerHTML += `<div>Do you want to send the emails? [Y/n]</div>`;
        document.getElementById('terminal-input-field').onkeypress = handleMassSendEmail;
    }
}
function handleMassSendEmail(event){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        if(commandTyped === 'Y' || commandTyped === 'y' || commandTyped === '' || commandTyped === 'yes'){
            output.innerHTML += `<div>[-] Sending emails...</div>`;
            fetch("send_email/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({emailSender, email, subject, body})
            })
                .then(response => response.json())
                .then(data => {
                    if(data.status === 'success'){
                        output.innerHTML += `<div>[-] Emails sent successfully</div>`;
                        output.innerHTML += `<div>[-] Press Enter to Continue or Ctrl-c to Exit</div>`;
                        document.getElementById('terminal-input-field').onkeypress = handleSetoolkitInput;
                        getToken();
                    }else{
                        output.innerHTML += `<div>[-] Emails not sent</div>`;
                        output.innerHTML += `<div>[-] Press Enter to Continue or Ctrl-c to Exit</div>`;
                        document.getElementById('terminal-input-field').onkeypress = handleSetoolkitInput;
                    }
                });
        }else{
            output.innerHTML += `<div>[-] Emails not sent</div>`;
            output.innerHTML += `<div>[-] Press Enter to Continue or Ctrl-c to Exit</div>`;
            document.getElementById('terminal-input-field').onkeypress = handleSetoolkitInput;
        }
    }
}

function showDownloadSetoolkit(){
    i = 1;
    const interval2 = setInterval(() => {
        if (i > 10) {
            clearInterval(interval2);
            output.innerHTML += `<div>SET has been updated successfully!<br></div>`;
            output.innerHTML += `
                    <div style="">
                        <pre style="color: #ffcc00;">
                
     Select from the menu:
                
      1) Social-Engineering Attacks
      4) Update the Social-Engineer Toolkit
      5) Update SET configuration
                
      99) Exit the Social-Engineer Toolkit
                        </pre>
                        </div>
                    `;
        } else {
            let arrows = '';
            for (let j = 0; j < i; j++) {
                arrows += '=';
            }
            arrows += '>';
            const percentage = i * 10;
            output.innerHTML += `<div>${percentage}% ${arrows}</div>`;
            i++;
        }
    }, 500);

}
let metasploitHeader =`<div style="">
            <pre style="color: #ffcc00;">
                                          ____________
     [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%| $a,        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
     [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%| $S\`?a,     |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
     [%%%%%%%%%%%%%%%%%%%%__%%%%%%%%%%|       \`?a, |%%%%%%%%__%%%%%%%%%__%%__ %%%%]
     [% .--------..-----.|  |_ .---.-.|       .,a$%|.-----.|  |.-----.|__||  |_ %%]
     [% |        ||  -__||   _||  _  ||  ,,aS$""\`  ||  _  ||  ||  _  ||  ||   _|%%]
     [% |__|__|__||_____||____||___._||%$P"\`       ||   __||__||_____||__||____|%%]
     [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%| \`"a,       ||__|%%%%%%%%%%%%%%%%%%%%%%%%%%]
     [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%|____\`"a,$$__|%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
     [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%        \`"$   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
     [%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%]
    
    
           =[ metasploit v6.3.55-dev                          ]
    + -- --=[ 11 exploits available                           ]
    + -- --=[ 10 payloads available                           ]
    + -- --=[ 5 exploitaible vulnerabilities                  ]
    
    Metasploit Documentation: https://docs.metasploit.com/

    </pre></div>`;
function metasploit(){
    clear();
    exploits = undefined;
    exploit_to_use = undefined;

    document.getElementById('terminal-input-field').value = '';
    terminalCursor = document.getElementById('terminal_name');
    terminalCursor.style.color = "#ffcc00";

    const output = document.getElementById('terminal-output');
    output.style.color = "#ffcc00";

    inputField = document.getElementById('terminal-input-field');
    inputField.style.color = "#ffcc00";
    output.innerHTML += metasploitHeader;
    output.innerHTML += `<div>[+] Starting database...</div>`;
    setTimeout(() => {
        output.innerHTML += `<div>[+] Database started</div>`;
        output.innerHTML += `<div>[+] Starting console</div>`;
        terminalCursor.innerHTML = "mfs6> ";

    }, 3000);
    document.getElementById('terminal-input-field').onkeypress = handleMetasploitInput;

}
function handleMetasploitInput(event){
    if(event.key === 'Enter'){
        commandTyped = document.getElementById('terminal-input-field').value;
        document.getElementById('terminal-input-field').value = '';
        const output = document.getElementById('terminal-output');

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
                output.innerHTML += `<br><div>------------------------------------</div>`;
                output.innerHTML += `<div>Comandi disponibili:</div>
                <div>help - Mostra l'elenco dei comandi disponibili</div>
                <div>clear - Pulisce il terminale</div>
                <div>search - Cerca un exploit</div>
                <div>use - Utilizza un exploit</div>
                <div>show option - Mostra informazioni</div>
                <div>exit - Chiudi metasploit</div>`;
                output.innerHTML += `<div>------------------------------------</div><br>`;
                break;
            case 'search':
                clear();
                if(!param)
                    output.innerHTML += `<div>Errore: inserire un servizio da cercare</div>`;
                else{
                    const output = document.getElementById('terminal-output');
                    fetch("get_exploit_info/" + param)
                        .then(response => response.json())
                        .then(data => {
                            if(data.exploits !== 'null'){
                                service = param;
                                exploits = data.exploits;
                                output.innerHTML += `<div><strong>Matching Modules</strong> </div>`;
                                output.innerHTML += `<div>==================================================================================</div>`;

                                const table = document.createElement('table');
                                table.style.borderCollapse = 'collapse';
                                table.style.width = '100%';

                                const headerRow = document.createElement('tr');
                                const headers = ['#', 'Name', 'Description'];
                                headers.forEach(headerText => {
                                    const th = document.createElement('th');
                                    th.style.border = 'none';
                                    th.style.padding = '8px';
                                    th.style.textAlign = 'left';
                                    th.textContent = headerText;
                                    headerRow.appendChild(th);
                                });
                                table.appendChild(headerRow);
                                output.appendChild(table);
                                length = Object.keys(exploits).length;
                                i =0;
                                for (const [key, value] of Object.entries(exploits)) {
                                    if(i<length) {
                                        const tr = document.createElement('tr');
                                        tr.style.border = 'none';
                                        tr.style.padding = '8px';
                                        tr.style.textAlign = 'left';
                                        const td1 = document.createElement('td');
                                        td1.textContent = i;
                                        tr.appendChild(td1);
                                        const td2 = document.createElement('td');
                                        td2.textContent = value;
                                        tr.appendChild(td2);
                                        const td3 = document.createElement('td');
                                        td3.textContent = key;
                                        tr.appendChild(td3);
                                        table.appendChild(tr);
                                        i++;
                                    }
                                }
                                output.innerHTML += `<div>--------------------------------------------------------------------------------</div>`;
                            }else
                                output.innerHTML += `<div>Exploit not found</div>`;
                        });
                }break;
            case 'use':
                if(!param)
                    output.innerHTML += `<div>Errore: inserire un exploit da utilizzare</div>`;
                else{
                    if(exploits === undefined){
                        output.innerHTML += `<div>[-] Cerca un exploit prima di usarlo</div>`;
                    }else{
                        flag = false;
                        target_port = undefined;
                        target_ip = undefined;
                        for (const [key, value] of Object.entries(exploits)) {
                            if(param === value){
                                exploit_to_use = value;
                                output.innerHTML += `<br><div>[-] Using exploit ${param}</div>`;
                                output.innerHTML += `<div>[-] Exploit ${param} loaded</div>`;
                                terminalCursor.innerHTML = "mfs6 (<strong>exploit: </strong> " + param + ")> ";
                                flag = true;
                            }
                        }
                        if(!flag)
                            output.innerHTML += `<br><div>[-] Exploit not found</div>`;
                    }
                }break;
            case 'show':
                if(param === 'options'){
                    if(exploit_to_use === undefined)
                        output.innerHTML += `<div>[-] Seleziona un exploit prima di visualizzare le opzioni</div>`;
                    else
                        output.innerHTML += `<br><div>[-] Options for ${exploit_to_use}</div>`;
                        const table = document.createElement('table');
                                table.style.borderCollapse = 'collapse';
                                table.style.width = '100%';

                                const headerRow = document.createElement('tr');
                                const headers = ['Name', 'Current Settings', 'Required', 'Description'];
                                headers.forEach(headerText => {
                                    const th = document.createElement('th');
                                    th.style.border = 'none';
                                    th.style.padding = '8px';
                                    th.style.textAlign = 'left';
                                    th.textContent = headerText;
                                    headerRow.appendChild(th);
                                });
                                table.appendChild(headerRow);
                                output.appendChild(table);
                                const tr = document.createElement('tr');
                                td = document.createElement('td');
                                td.textContent = 'RHOSTS';
                                td1 = document.createElement('td');
                                td1.textContent = target_ip;
                                tr.appendChild(td);
                                tr.appendChild(td1);
                                td2 = document.createElement('td');
                                td2.textContent = 'yes';
                                tr.appendChild(td2);
                                td3 = document.createElement('td');
                                td3.textContent = 'The target host(s)';
                                tr.appendChild(td3);
                                table.appendChild(tr);

                                const tr1 = document.createElement('tr');
                                td0 = document.createElement('td');
                                td0.textContent = 'RPORT';
                                tr1.appendChild(td0);
                                td4 = document.createElement('td');
                                td4.textContent = target_port;
                                tr1.appendChild(td4);
                                td5 = document.createElement('td');
                                td5.textContent = 'yes';
                                tr1.appendChild(td5);
                                td6 = document.createElement('td');
                                td6.textContent = 'The target port (TCP)';
                                tr1.appendChild(td6);
                                table.appendChild(tr1);
                                output.appendChild(table);


                }else{
                    output.innerHTML += `<br><div>[-] Comando non riconosciuto</div>`;
                }

                break;
            case 'set':
                params = param.split(' ');
                if(params[0].toUpperCase() === 'RHOSTS'){
                    console.log(params[1]);
                    target_ip = params[1];
                    output.innerHTML += `<br><div>[-] RHOSTS => ${target_ip}</div>`;
                }else if(params[0].toUpperCase() === 'RPORT'){
                    console.log(params[1]);
                    target_port = params[1];
                    output.innerHTML += `<br><div>[-] RPORT => ${target_port}</div>`;
                }
                else{
                    output.innerHTML += `<br><div>[-] Comando non riconosciuto</div>`;
                }
                break;
            case 'exploit':
                if(exploit_to_use === undefined || service === undefined)
                    output.innerHTML += `<div>[-] Seleziona un exploit prima di utilizzarlo</div>`;
                else{
                    if(target_ip === undefined || target_port === undefined)
                        output.innerHTML += `<div>[-] Inserisci l'indirizzo IP e la porta del target</div>`;
                    else{
                        output.innerHTML += `<div>[-] Attacco in corso...</div>`;
                        fetch("exploit/", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({target_ip, target_port,service})
                        })
                            .then(response => response.json())
                            .then(data => {
                                if(data.token !== 'error'){
                                    output.innerHTML += `<div>[-] Attacco riuscito </div><br>[+] Token: ${data.token}`;

                                }else{
                                    output.innerHTML += `<div>[-] Attacco non riuscito, controllare i parametri</div>`;
                                }
                            });
                    }
                }
                break;
            case 'exit':
                clear();
                terminalCursor = document.getElementById('terminal_name');
                terminalCursor.innerHTML = defaultTerminalCursor;
                terminalCursor.style.color = "#33ff33";

                terminalInput = document.getElementById('terminal-input-field');
                terminalInput.style.color = "#33ff33";

                output.style.color = "#33ff33";

                document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;
                break;
            case 'clear':
                clear();
                break;
            default:
                output.innerHTML += `<div>Comando non riconosciuto. Digita “help” per visualizzare l'elenco dei comandi disponibili.</div>`;
                break;
        }
    }
}
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
}

function getToken(emailSender, email, subject, body) {
    fetch("get_token_from_phishing/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({emailSender, email, subject, body})
    })
        .then(response => response.json())
        .then(data => {
        });
}
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'c') {
        if(document.getElementById('terminal').style.display !== 'none') {
            if (document.getElementById('terminal-input-field').onkeypress === handleSpiderfootInput) {
                clear();
                terminalCursor = document.getElementById('terminal_name');
                terminalCursor.innerHTML = defaultTerminalCursor;
                terminalCursor.style.color = "#33ff33";
                terminalInput = document.getElementById('terminal-input-field');
                terminalInput.style.color = "#33ff33";
                output = document.getElementById('terminal-output');
                output.style.color = "#33ff33";
                document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;
            }
            if(document.getElementById('terminal-input-field').onkeypress === handleSetoolkitInput ||
                document.getElementById('terminal-input-field').onkeypress === handleEmailSenderInputForMassAttack ||
                document.getElementById('terminal-input-field').onkeypress === handleNumberEmailForAttack ||
                document.getElementById('terminal-input-field').onkeypress === handleEmailInput ||
                document.getElementById('terminal-input-field').onkeypress === handleSubjectInput ||
                document.getElementById('terminal-input-field').onkeypress === handleBodyInput ||
                document.getElementById('terminal-input-field').onkeypress === handleMassSendEmail ||
                document.getElementById('terminal-input-field').onkeypress === handleEmailSenderInputForSingleAttack){
                clear();

                terminalCursor = document.getElementById('terminal_name');
                terminalCursor.innerHTML = defaultTerminalCursor;
                terminalCursor.style.color = "#33ff33";
                terminalInput = document.getElementById('terminal-input-field');
                terminalInput.style.color = "#33ff33";
                output = document.getElementById('terminal-output');
                output.style.color = "#33ff33";
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