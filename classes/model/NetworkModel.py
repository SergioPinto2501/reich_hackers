import random
from typing import Any, Dict, List
from classes.model.NetworkNodeModel import NetworkNode

class NetworkModel:

    nodes = []
    def __init__(self):
        self.nodes = self.generate_nodes()

    def generate_nodes(self) -> List[NetworkNode]:
        nodes = []
        used_names = set()
        used_ips = set()
        database_count = 0

        for _ in range(20):
            name = self.generate_unique_name(used_names)
            ip = self.generate_unique_ip(used_ips)
            if database_count < 5:
                node_type = "Database"
                database_count += 1
            else:
                node_type = "Computer"
            node = NetworkNode(name=name, ip=ip, type=node_type)
            nodes.append(node)

        return nodes

    def generate_unique_name(self, used_names: set) -> str:
        while True:
            name = f"Node-{random.randint(1, 1000)}"
            if name not in used_names:
                used_names.add(name)
                return name

    def generate_unique_ip(self, used_ips: set) -> str:
        while True:
            ip = f"192.168.1.{random.randint(1, 254)}"
            if ip not in used_ips:
                used_ips.add(ip)
                return ip

    def get_nodes(self) -> List[Dict[str, Any]]:
        return self.nodes
    def show_nodes(self):
        for node in self.nodes:
            print(node)