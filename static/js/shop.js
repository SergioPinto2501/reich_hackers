document.getElementById('buy_software').onclick = showShop;
document.querySelector('.shop-controls .close').onclick = hideShop;
document.querySelector('.shop-controls .minimize').onclick = hideShop;

function showShop() {
        div = document.getElementById('shop');
        div.style.display = 'block';
}
function hideShop() {
        div = document.getElementById('shop');
        div.style.display = 'none';

}
function showShop() {
        div = document.getElementById('shop');
        div.style.display = 'block';
}

document.getElementById("nmap").addEventListener("click", function() {
    message_div = document.getElementById('message-for-player');
    message_div.style.zIndex = 3000;
    message_div.innerHTML = "Nmap è un software di scansione di rete. Vuoi acquistarlo?";
    message_div.style.display = 'block';

    button_yes = document.createElement('button');
    button_yes.innerHTML = 'Sì';
    button_no = document.createElement('button');
    button_no.innerHTML = 'No';

    message_div.appendChild(button_yes);
    message_div.appendChild(button_no);

    button_yes.onclick = function() {
        fetch('/check_tool/nmap')
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                fetch('/add_tool/nmap')
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            message_div.innerHTML = "Hai acquistato Nmap!";
                            button = document.createElement('button');
                            button.innerHTML = 'OK';
                            button.onclick = function() {
                                message_div.style.display = 'none';
                                window.location.reload();
                            };
                            message_div.appendChild(button);
                        } else {
                            alert("Non hai abbastanza soldi per acquistare Nmap!");
                            message_div.style.display = 'none';
                        }
                    });
            }else {
                  message_div.innerHTML = "Hai acquistato Nmap in precedenza!";
                  button = document.createElement('button');
                  button.innerHTML = 'OK';
                  button.onclick = function() {
                      message_div.style.display = 'none';
                  };
                    message_div.appendChild(button);
            }
    });

    button_no.onclick = function() {
        message_div.style.display = 'none';
    };
}});
document.getElementById("vuln_scan").addEventListener("click", function() {
    message_div = document.getElementById('message-for-player');
    message_div.style.zIndex = 3000;
    message_div.innerHTML = "Vuoi acquistare lo script di Nmap per la scansione delle vulnerabilità?";
    message_div.style.display = 'block';

    button_yes = document.createElement('button');
    button_yes.innerHTML = 'Sì';
    button_no = document.createElement('button');
    button_no.innerHTML = 'No';

    message_div.appendChild(button_yes);
    message_div.appendChild(button_no);

    button_yes.onclick = function() {
        fetch('/check_tool/vuln_scan')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    fetch('/add_tool/vuln_scan')
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                message_div.innerHTML = "Hai acquistato il software di scansione vulnerabilità!";
                                button = document.createElement('button');
                                button.innerHTML = 'OK';
                                button.onclick = function () {
                                    message_div.style.display = 'none';
                                    window.location.reload();
                                };
                                message_div.appendChild(button);
                            } else {
                                alert("Non hai abbastanza soldi per acquistare il software di scansione vulnerabilità!");
                                message_div.style.display = 'none';
                            }
                        });
                } else {
                    message_div.innerHTML = "Hai acquistato il software di scansione vulnerabilità in precedenza!";
                    button = document.createElement('button');
                    button.innerHTML = 'OK';
                    button.onclick = function () {
                        message_div.style.display = 'none';
                    };
                    message_div.appendChild(button);
                }
            });

        button_no.onclick = function () {
            message_div.style.display = 'none';
        };
    }
});
document.getElementById("exploitDB").addEventListener("click", function() {
    message_div = document.getElementById('message-for-player');
    message_div.style.zIndex = 3000;
    message_div.innerHTML = "Vuoi acquistare il tool utilizzabile da terminale di ExploitDB?";
    message_div.style.display = 'block';

    button_yes = document.createElement('button');
    button_yes.innerHTML = 'Sì';
    button_no = document.createElement('button');
    button_no.innerHTML = 'No';

    message_div.appendChild(button_yes);
    message_div.appendChild(button_no);

    button_yes.onclick = function() {
        fetch('/check_tool/exploitDB')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    fetch('/add_tool/exploitDB')
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                message_div.innerHTML = "Hai acquistato il tool!";
                                button = document.createElement('button');
                                button.innerHTML = 'OK';
                                button.onclick = function () {
                                    message_div.style.display = 'none';
                                    window.location.reload();
                                };
                                message_div.appendChild(button);
                            } else {
                                alert("Non hai abbastanza soldi per acquistare il tool ");
                                message_div.style.display = 'none';
                            }
                        });
                } else {
                    message_div.innerHTML = "Hai acquistato il tool in precedenza!";
                    button = document.createElement('button');
                    button.innerHTML = 'OK';
                    button.onclick = function () {
                        message_div.style.display = 'none';
                    };
                    message_div.appendChild(button);
                }
            });

        button_no.onclick = function () {
            message_div.style.display = 'none';
        };
    }
});


