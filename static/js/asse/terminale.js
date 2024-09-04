
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
    terminalCursor = document.getElementById('terminal_name');
    terminalCursor.innerHTML = defaultTerminalCursor;
    terminalCursor.style.color = "#33ff33";
    terminalInput = document.getElementById('terminal-input-field');
    terminalInput.style.color = "#33ff33";
    output = document.getElementById('terminal-output');
    output.style.color = "#33ff33";
    document.getElementById('terminal-input-field').onkeypress = handleTerminalInput;
}