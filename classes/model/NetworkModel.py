import random
from typing import Any, Dict, List
from classes.model.NetworkNodeModel import NetworkNode

class NetworkModel:

    faction = None
    nodes = []

    nomi_alleati = ["John", "James", "Robert", "Michael", "David", "William", "George", "Charles", "Joseph", "Vladimir",
                    "Mary", "Elizabeth",
                    "Patricia", "Margaret", "Barbara", "Susan", "Dorothy", "Nancy", "Frances", "Olga"]

    cognomi_alleati = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Miller", "Davis", "Wilson", "Taylor",
                       "Anderson", "Martin", "Thompson", "White", "Moore", "Clark", "Lewis", "Walker", "Hall", "Young",
                       "King"]

    nomi_asse = ["Giovanni", "Antonio", "Mario", "Francesco", "Luigi", "Hans", "Heinrich", "Friedrich", "Kurt",
                 "Hiroshi", "Maria", "Anna", "Giuseppina", "Rosa", "Franca", "Helga", "Ingrid", "Ursula", "Yoko",
                 "Sakura"]

    cognomi_asse = ["Rossi", "Bianchi", "Ricci", "Conti", "De Luca", "Müller", "Schmidt", "Schneider", "Fischer",
                    "Tanaka", "Kobayashi", "Yamamoto", "Ito", "Watanabe", "Sato", "Weber", "Maier", "Bauer", "Hoffmann",
                    "Richter"]


    original_cities_coordinates_dict_for_allies= {
        "Londra": (51.5074, -0.1278),
        "Washington D.C.": (38.8951, -77.0369),
        "New York City": (40.7128, -74.0060),
        "Mosca": (55.7558, 37.6173),
        "Stalingrado (Volgograd)": (48.7080, 44.5133),
        "Algeri": (36.7372, 3.0865),
        "Parigi": (48.8566, 2.3522),
        "Lisbona": (38.7223, -9.1399),
        "Bruxelles": (50.8503, 4.3517),
        "Ankara": (39.9334, 32.8597),
        "Atene": (37.9838, 23.7275),
        "Toronto": (43.6510, -79.3470),
        "San Paolo": (-23.5505, -46.6333),
        "Sydney": (-33.8688, 151.2093),
        "Città del Messico": (19.4326, -99.1332),
        "Helsinki": (60.1692, 24.9402),
        "Kiev": (50.4501, 30.5234),
        "San Pietroburgo (Leningrado)": (59.9343, 30.3351)
    }
    original_cities_coordinates_dict_for_axies = {
        "Berlino": (52.5200, 13.4050),  # Germania
        "Roma": (41.9028, 12.4964),  # Italia
        "Tokyo": (35.6824, 139.7590),  # Giappone
        "Osaka": (34.6937, 135.5023),  # Giappone
        "Milano": (45.4642, 9.1900),  # Italia
        "Napoli": (40.8522, 14.2681),  # Italia
        "Monaco di Baviera": (48.1351, 11.5820),  # Germania
        "Dresda": (51.0504, 13.7373),  # Germania
        "Colonia": (50.9375, 6.9603),  # Germania
        "Tripoli": (32.8872, 13.1913),  # Libia (colonia italiana)
        "Addis Abeba": (9.0306, 38.7400),  # Etiopia (occupata dall'Italia)
        "Asmara": (15.3229, 38.9251),  # Eritrea (colonia italiana)
        "Nanchino": (32.0603, 118.7969)  # Cina (occupata dal Giappone)
    }


    def __init__(self, faction):
        self.faction = faction
        self.nodes = self.generate_nodes()


    @classmethod
    def recoverNodes(self, network) -> List[NetworkNode]:
        self = NetworkModel.__new__(NetworkModel)
        self.nodes = []
        for node in network:
            node = NetworkNode.recover_node(node.get("name"), node.get("ip"), node.get("type"), node.get("os"), node.get("open_ports"), node.get("services"), node.get("lat"), node.get("lon"), node.get("city"), node.get("status"),
                                            node.get("token"), node.get("employeeName"), node.get("employeeSurname"), node.get("email"), node.get("password"), node.get("phishing_index"))
            self.nodes.append(node)

        return self

    def generate_nodes(self) -> List[NetworkNode]:
        if(self.faction == "Alleati"):
            duplicate_cities_coordinates_dict = self.original_cities_coordinates_dict_for_allies.copy()
        else:
            duplicate_cities_coordinates_dict = self.original_cities_coordinates_dict_for_axies.copy()

        nodes = []
        used_names = set()
        used_ips = set()
        used_tokens = set()
        database_count = 0

        for _ in range(10):
            token = self.generete_unique_token(used_tokens)
            name = self.generate_unique_name(used_names)
            ip = self.generate_unique_ip(used_ips)
            if database_count < 3:
                node_type = "Database"
                database_count += 1
            else:
                node_type = "Computer"

            #Pick random city coordinates
            city = random.choice(list(duplicate_cities_coordinates_dict.keys()))

            lat = duplicate_cities_coordinates_dict[city][0]
            lon = duplicate_cities_coordinates_dict[city][1]
            del duplicate_cities_coordinates_dict[city]

            employee_name = self.generate_name()
            employee_surname = self.generate_surname()
            email = self.generate_email(employee_name, employee_surname)

            node = NetworkNode(name=name, ip=ip, type=node_type, lat=lat, lon=lon, city=city, token=token, employeeName=employee_name, employeeSurname=employee_surname, email=email)

            nodes.append(node)

        return nodes

    def generate_unique_name(self, used_names: set) -> str:
        while True:
            name = f"Node-{random.randint(1, 1000)}"
            if name not in used_names:
                used_names.add(name)
                return name

    def generete_unique_token(self, used_tokens: set) -> str:
        while True:
            token = f"Token-{random.randint(1, 1000)}"
            if token not in used_tokens:
                used_tokens.add(token)
                return token
    def generate_unique_ip(self, used_ips: set) -> str:
        while True:
            if(self.faction == "Alleati"):
                ip = f"192.168.4.{random.randint(1, 254)}"
            else:
                ip = f"192.168.3.{random.randint(1, 254)}"

            if ip not in used_ips:
                used_ips.add(ip)
                return ip

    def get_nodes(self) -> List[Dict[str, Any]]:
        return self.nodes
    def show_nodes(self):
        for node in self.nodes:
            print(node)

    def get_node_by_name(self, name: str) -> NetworkNode:
        for node in self.nodes:
            if node.get_name() == name:
                return node

    def get_node_by_ip(self, ip: str) -> NetworkNode:
        for node in self.nodes:
            if node.get_ip() == ip:
                return node

    def generate_name(self) -> str:
        if (self.faction == "Alleati"):
            return random.choice(self.nomi_alleati)
        else:
            return random.choice(self.nomi_asse)

    def generate_surname(self) -> str:
        if (self.faction == "Alleati"):
            return random.choice(self.cognomi_alleati)
        else:
            return random.choice(self.cognomi_asse)

    def generate_email(self, name: str, surname: str) -> str:
        if (self.faction == "Alleati"):
            return name.lower() + "." + surname.lower() + "@allies.com"
        else:
            return name.lower() + "." + surname.lower() + "@axis.com"

    def check_if_exist_person(self, email) -> bool:
        for node in self.nodes:
            if node.get_email() == email:
                return True
        return False