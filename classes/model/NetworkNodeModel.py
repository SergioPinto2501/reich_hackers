import logging
import random
import string
from typing import List, Dict, Optional, Any


class NetworkNode:
    vulnerable_random_numer = 0
    def __init__(self, name, ip, type, lat, lon, city) -> None:
        self.name = name
        self.type = type
        self.lat = lat
        self.lon = lon
        self.city = city
        self.status = "online"
        self.os = self.generate_os()
        self.ip = ip
        self.open_ports = self.generate_open_ports()
        self.services = self.generate_services(vulnerabile_index=NetworkNode.vulnerable_random_numer)

        if self.type == "Database":
            self.data = self.generate_database_data()
            self.db_engine = random.choice(["MySQL", "PostgreSQL", "SQLite", "MongoDB"])

    @classmethod
    def recover_node(self, name, ip, type, os, open_ports, services, lat, lon, city, status) -> 'NetworkNode':
        self = NetworkNode.__new__(NetworkNode) # Create a new instance without calling __init__
        self.name = name
        self.ip = ip
        self.type = type
        self.os = os
        self.open_ports = open_ports
        self.services = services
        self.lat = lat
        self.lon = lon
        self.city = city
        self.status = status
        return self

    def generate_os(self) -> str:
        if(self.type) == "Database":
            os_list = ["Ubuntu 20.04","Windows Server 2019"]
        else:
            os_list = ["Windows 10", "CentOS 8", "macOS Big Sur", "Debian 10"]
        return random.choice(os_list)


    def generate_open_ports(self) -> List[int]:
        port = []
        casual_db_port = [3306, 5432, 8080, 27017]
        casual_port = [21, 22, 25, 53, 80, 443]
        port_to_add = 0
        NetworkNode.vulnerable_random_numer = random.randint(0, 10)
        if (NetworkNode.vulnerable_random_numer == 0):
            logging.info("Nodo non vulnerabile")
        else:
            logging.info("Nodo vulnerabile - Vulnerabilità: "+ str(NetworkNode.vulnerable_random_numer))

        match NetworkNode.vulnerable_random_numer:
            case 1:
                port_to_add = 21
            case 2:
                port_to_add = 22
            case 3:
                port_to_add = 25
            case 4:
                port_to_add = 53
            case 5:
                port_to_add = 80
            case 6:
                port_to_add = 443
            case 7:
                port_to_add = 3306
            case 8:
                port_to_add = 5432
            case 9:
                port_to_add = 8080
            case 10:
                port_to_add = 27017
            case _:
                port_to_add = 0 # Default case, non vulnerabile

        if self.type == "Computer":
            num_open_ports = random.randint(1, 3)
            port = random.sample(casual_port, num_open_ports)
        if self.type == "Database":
            num_open_ports = random.randint(1, 3)
            port = random.sample(casual_port, num_open_ports)
            port += random.sample(casual_db_port, 1)

        if(port_to_add not in port and port_to_add != 0):
            if(type == "Database" and port_to_add in casual_db_port):
                port.remove(port[0])
                port.append(port_to_add)


        return port

    def generate_services(self, vulnerabile_index) -> Dict[int, str]:
        vulenrabile_services = {

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

        #Da aggiungere alla documentazione
        not_vulnerabile_services = {
            21: ["FTP vsftpd 3.0.3", "FTP vsftpd 3.0.2"],
            22: ["SSH OpenSSH 8.4", "SSH OpenSSH 7.9"],
            25: ["SMTP Postfix 3.5.6", "SMTP Postfix 3.4.7"],
            53: ["DNS BIND 9.16.12", "DNS BIND 9.11.26"],
            80: ["HTTP Apache 2.4.48", "HTTP Apache 2.4.46"],
            443: ["HTTPS Nginx 1.20.1", "HTTPS Nginx 1.19.10"],
            3306: ["MySQL 8.0.25", "MySQL 8.0.23"],
            5432: ["PostgreSQL 13.4", "PostgreSQL 12.7"],
            8080: ["SQLite 3.35.5", "SQLite 3.34.1"],
            27017: ["MongoDB 4.4.6", "MongoDB 4.2.14"]
        }


        generated_services = {}

        for port in self.open_ports:
            match vulnerabile_index:
                case 0:
                    service = random.choice(not_vulnerabile_services[port])
                case 1:
                    if(port == 21):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 2:
                    if(port ==22):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 3:
                    if(port == 25):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 4:
                    if(port == 53):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 5:
                    if(port == 80):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 6:
                    if(port == 443):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 7:
                    if(port == 3306):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 8:
                    if(port == 5432):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 9:
                    if(port == 8080):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])
                case 10:
                    if(port == 27017):
                        service = random.choice(vulenrabile_services[port])
                    else:
                        service = random.choice(not_vulnerabile_services[port])

            generated_services[port] = service

        return generated_services

    def generate_database_data(self) -> List[Dict[str, str]]:
        token_length = 16  # Specify the length of the token
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=token_length))
        return [{"type": "Token", "value": token}]


    def genereate_ip(self) -> str:
        initial_byte = '192.168.1'
        last_byte = random.randint(1, 254)
        return initial_byte + '.' + str(last_byte)

    def toString(self):
        return self.name + " " + self.ip + " " + self.type + " " + self.os + " " + str(self.open_ports) + " " + str(self.services) + " " + str(self.lat) + " " + str(self.lon) + " " + self.city
    def to_dict(self):
        node_dict = {
            'name': self.name,
            'ip': self.ip,
            'type': self.type,
            'os': self.os,
            'open_ports': self.open_ports,
            'services': self.services,
            'lat': self.lat,
            'lon': self.lon,
            'city': self.city,
            'status': self.status

        }
        return node_dict

    def get_status(self) -> str:
        return self.status
    def get_name(self) -> str:
        return self.name

    def get_ip(self) -> str:
        return self.ip
