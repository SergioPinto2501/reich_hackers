import random
import string
from typing import List, Dict, Optional


class MITREATTACKDatabase:
    techniques = {
        "T1190": {
            "name": "Exploit Public-Facing Application",
            "tactic": "Initial Access",
            "description": "Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended or unanticipated behavior."
        },
        "T1133": {
            "name": "External Remote Services",
            "tactic": "Initial Access",
            "description": "Adversaries may leverage external-facing remote services to initially access and/or persist within a network."
        },
        "T1068": {
            "name": "Exploitation for Privilege Escalation",
            "tactic": "Privilege Escalation",
            "description": "Adversaries may exploit software vulnerabilities in an attempt to elevate privileges."
        },
        "T1203": {
            "name": "Exploitation for Client Execution",
            "tactic": "Execution",
            "description": "Adversaries may exploit software vulnerabilities in client applications to execute code."
        },
        "T1213": {
            "name": "Data from Information Repositories",
            "tactic": "Collection",
            "description": "Adversaries may leverage information repositories to mine valuable information."
        }
    }

    @classmethod
    def get_technique(cls, technique_id):
        return cls.techniques.get(technique_id, None)


class Vulnerability:
    def __init__(self, name, cve, description, affected_systems, mitre_techniques):
        self.name = name
        self.cve = cve
        self.description = description
        self.affected_systems = affected_systems
        self.mitre_techniques = mitre_techniques

    def is_applicable(self, os):
        return os in self.affected_systems

    def get_random_technique(self):
        return random.choice(self.mitre_techniques)


class VulnerabilityDatabase:
    vulnerabilities = [
        Vulnerability("Remote Code Execution", "CVE-2021-34527",
                      "Remote Code Execution vulnerability in Windows Print Spooler",
                      ["Windows 10"], ["T1190", "T1068"]),
        Vulnerability("SQL Injection", "CVE-2021-27896", "SQL Injection vulnerability in MySQL",
                      ["Ubuntu 20.04", "CentOS 8"], ["T1190", "T1213"]),
        Vulnerability("Buffer Overflow", "CVE-2021-32760", "Buffer Overflow vulnerability in Linux kernel",
                      ["Ubuntu 20.04", "CentOS 8", "Debian 10"], ["T1203", "T1068"]),
        Vulnerability("Cross-Site Scripting", "CVE-2021-23406", "XSS vulnerability in popular web framework",
                      ["Windows 10", "Ubuntu 20.04", "CentOS 8", "macOS Big Sur", "Debian 10"], ["T1190"]),
        Vulnerability("Privilege Escalation", "CVE-2021-41773",
                      "Privilege Escalation vulnerability in Apache HTTP Server",
                      ["Ubuntu 20.04", "CentOS 8", "Debian 10"], ["T1068"])
    ]

    @classmethod
    def get_applicable_vulnerabilities(cls, os):
        return [vuln for vuln in cls.vulnerabilities if vuln.is_applicable(os)]


class NetworkNode:
    node_counter = 0

    def __init__(self):
        NetworkNode.node_counter += 1
        self.id = NetworkNode.node_counter
        self.name = self.generate_name()
        self.type = random.choice(["Computer", "Database"])
        self.os = self.generate_os()
        self.vulnerability = self.generate_vulnerability()
        self.open_ports = self.generate_open_ports()
        self.services = self.generate_services()

        if self.type == "Database":
            self.data = self.generate_database_data()

    def generate_name(self) -> str:
        prefix = random.choice(["SRV", "NODE", "HOST", "DEVICE"])
        suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"{prefix}-{suffix}"

    def generate_os(self) -> str:
        os_list = ["Windows 10", "Ubuntu 20.04", "CentOS 8", "macOS Big Sur", "Debian 10"]
        return random.choice(os_list)

    def generate_vulnerability(self) -> Dict[str, str]:
        applicable_vulns = VulnerabilityDatabase.get_applicable_vulnerabilities(self.os)
        if not applicable_vulns:
            return None

        vuln = random.choice(applicable_vulns)
        technique_id = vuln.get_random_technique()
        technique = MITREATTACKDatabase.get_technique(technique_id)

        return {
            "name": vuln.name,
            "cve": vuln.cve,
            "description": vuln.description,
            "mitre_technique": technique_id,
            "mitre_tactic": technique["tactic"],
            "mitre_description": technique["description"]
        }

    def generate_open_ports(self) -> List[int]:
        all_ports = [21, 22, 23, 25, 53, 80, 443, 3306, 5432, 8080]
        num_open_ports = random.randint(2, 5)
        return random.sample(all_ports, num_open_ports)

    def generate_services(self) -> Dict[int, str]:
        services = {
            21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
            53: "DNS", 80: "HTTP", 443: "HTTPS", 3306: "MySQL",
            5432: "PostgreSQL", 8080: "HTTP-Proxy"
        }
        return {port: services[port] for port in self.open_ports}

    def generate_database_data(self) -> List[Dict[str, str]]:
        data_types = ["User Credentials", "Financial Records", "Personal Information", "Product Data"]
        return [{"type": random.choice(data_types), "value": f"Sample {i}"} for i in range(1, 6)]

    def __str__(self) -> str:
        node_info = f"Node ID: {self.id}\n"
        node_info += f"Name: {self.name}\n"
        node_info += f"Type: {self.type}\n"
        node_info += f"OS: {self.os}\n"
        if self.vulnerability:
            node_info += f"Vulnerability: {self.vulnerability['name']} (CVE: {self.vulnerability['cve']})\n"
            node_info += f"MITRE ATT&CK:\n"
            node_info += f"  - Technique: {self.vulnerability['mitre_technique']}\n"
            node_info += f"  - Tactic: {self.vulnerability['mitre_tactic']}\n"
            node_info += f"  - Description: {self.vulnerability['mitre_description']}\n"
        else:
            node_info += "No applicable vulnerabilities found.\n"
        node_info += f"Open Ports: {', '.join(map(str, self.open_ports))}\n"
        node_info += f"Services: {', '.join([f'{port}: {service}' for port, service in self.services.items()])}\n"

        if self.type == "Database":
            node_info += "Database Data:\n"
            for item in self.data:
                node_info += f"  - {item['type']}: {item['value']}\n"

        return node_info


# Esempio di utilizzo