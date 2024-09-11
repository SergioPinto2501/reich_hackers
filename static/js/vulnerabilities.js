document.getElementById('show-vulnerabilities').onclick = showVulnerabilities;
document.querySelector('.vulnerabilities-controls .close').onclick = hideVulnerabilities;
document.querySelector('.vulnerabilities-controls .minimize').onclick = hideVulnerabilities;

function showVulnerabilities() {
    div = document.getElementById("vulnerabilities");
    div.style.display = "block";
    clearAll();
    addAllNodesOfPlayer();
}
function hideVulnerabilities() {
    div = document.getElementById("vulnerabilities");
    div.style.display = "none";
    clearAll();
}
function addAllNodesOfPlayer() {
    fetch('/get_network_info/')
    .then(response => response.json())
    .then(data => {
        div = document.getElementById("vulnerabilities-frame");
        h1 = document.createElement("h1");
        h1.innerHTML = "Vulnerabilità della tua rete";
        div.appendChild(h1);
        let coutnVuln = 0;
        data.network.forEach(node => {
            let services = {};
            if (node.services.startsWith('{') && node.services.endsWith('}')) {
                const pairs = node.services.slice(1, -1).split(', ');
                for (const pair of pairs) {
                    const [key, value] = pair.split(': ');
                    services[parseInt(key)] = value.slice(1, -1); // Rimuovi le virgolette
                }
            }
            // Convert the services object into a string
            let porte = '';
            let servizi = '';
            Object.entries(services).forEach(([port, service]) => {
                porte += port + ', ';
                servizi += service + ', ';
            });
            porte = porte.slice(0, -2);
            servizi = servizi.slice(0, -2);

            //PROVA
            let servicesDictionary = {};
            const portsArray = porte.split(', ');
            const servicesArray = servizi.split(', ');

            portsArray.forEach((port, index) => {
                servicesDictionary[port] = servicesArray[index];
            });

            vulnerabileService = checkVulnerableServices(servicesDictionary);
            if(vulnerabileService.length !== 0) {
                coutnVuln++;
                div = document.getElementById("vulnerabilities-frame");
                divNode = document.createElement("div");
                divNode.className = "node";
                h2 = document.createElement("h2");
                h2.innerHTML = node.name;
                divNode.appendChild(h2);

                p = document.createElement("p");
                p.innerHTML = "Città: " + node.city;
                divNode.appendChild(p);

                p = document.createElement("p");
                p.innerHTML = "OS: " + node.os;
                divNode.appendChild(p);

                p = document.createElement("p");
                p.innerHTML = "IP: " + node.ip;
                divNode.appendChild(p);

                p = document.createElement("p");
                p.innerHTML = "Porte Aperte Vulnerabili: " + vulnerabileService.map(service => service.port).join(', ');
                divNode.appendChild(p);

                p = document.createElement("p");
                p.innerHTML = "Servizi Vulnerabili: " + vulnerabileService.map(service => service.service).join(', ');
                divNode.appendChild(p);

                p = document.createElement("div");
                p.innerHTML = "Costo Fix: 40"
                p.className = "price";

                imgB = document.createElement("img");
                imgB.src = "/static/images/resource/ByteCoin.png";
                imgB.alt = "ByteCoin";
                p.appendChild(imgB);
                divNode.appendChild(p);
                button = document.createElement("button");
                button.id = node.name;
                button.className = "button-repair";
                button.innerHTML = "Ripara Vulnerabilità";
                button.onclick = function() {
                    const clickedButton = this;
                    vulnerabileService = checkVulnerableServices(servicesDictionary);
                    serviceToRepair = transformServices(vulnerabileService);

                    fetch('/repair_vulnerabilities/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({name: clickedButton.id, ip: node.ip, services: vulnerabileService, servicesFixit: serviceToRepair}),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert("Vulnerabilità riparate con successo!");
                            window.location.reload();
                            hideVulnerabilities();
                        } else {
                            alert("Errore nella riparazione delle vulnerabilità");
                        }
                    });
                }
                divNode.appendChild(button);
                div.appendChild(divNode);
            }
        });
        if(coutnVuln === 0) {
            div = document.getElementById("vulnerabilities-frame");
            divNode = document.createElement("div");
            divNode.className = "node";
            h2 = document.createElement("h2");
            h2.innerHTML = "Nessuna vulnerabilità trovata";
            divNode.appendChild(h2);
            div.appendChild(divNode);
        }

    });
}

function checkVulnerableServices(nodeServices) {
    const vulnerableServices = [];
    for (const [port, service] of Object.entries(nodeServices)) {
        for (const vulnService of vulenrabile_services[port]) {
            if (service === vulnService) {
                vulnerableServices.push({ port, service });
            }
        }
    }
    return vulnerableServices;
}
function transformServices(services) {
   const finalServices = [];
   for (const port in services) {
        for (const [porta, service_vul] of Object.entries(not_vulnerabile_services)) {
            if (services[port].port === porta) {
                finalServices.push({port: porta, service: service_vul[0]});
            }

        }
   }
    return finalServices;

}
const vulenrabile_services = {
            21: ["FTP vsftpd 2.3.4", "FTP vsftpd 2.0.5"],
            22: ["SSH OpenSSH 6.6"],
            25: ["SMTP Exim 4.87"],
            53: ["DNS BIND 9.4.2"],
            80: ["HTTP Apache 2.2.34", "HTTP Apache 2.2.29"],
            3306: ["MySQL 5.5.52", "MySQL 5.6.31", "MySQL 5.7.15"],
            5432: ["PostgreSQL 9.3.10", "PostgreSQL 9.4.5", "PostgreSQL 9.5.2"],
            8080: ["SQLite 3.31.1", "SQLite 3.32.0", "SQLite 3.28.0"],
            27017: ["MongoDB 2.6.10", "MongoDB 3.4.0", "MongoDB 3.2.0"]
}
const not_vulnerabile_services = {
            21: ["FTP vsftpd 3.0.3"],
            22: ["SSH OpenSSH 8.4"],
            25: ["SMTP Postfix 3.5.6"],
            53: ["DNS BIND 9.16.12"],
            80: ["HTTP Apache 2.4.48"],
            3306: ["MySQL 8.0.25", "MySQL 8.0.23"],
            5432: ["PostgreSQL 13.4", "PostgreSQL 12.7"],
            8080: ["SQLite 3.35.5", "SQLite 3.34.1"],
            27017: ["MongoDB 4.4.6", "MongoDB 4.2.14"]
}
function clearAll() {
    div = document.getElementById("vulnerabilities-frame");
    div.innerHTML = "";
    divVuln = document.createElement("div");
    divVuln.className = "vulnerabilities-header";
    divControls = document.createElement("div");
    divControls.className = "vulnerabilities-controls";
    span = document.createElement("span");
    span.className = "control close";
    span.onclick = hideVulnerabilities;
    divControls.appendChild(span);
    span = document.createElement("span");
    span.className = "control minimize";
    span.onclick = hideVulnerabilities;
    divControls.appendChild(span);
    divVuln.appendChild(divControls);
    div.appendChild(divVuln);
}

