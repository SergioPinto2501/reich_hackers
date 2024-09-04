from classes.model.NetworkModel import NetworkModel

class Player:
    username = None
    faction = None
    network = None
    ByteCoin = 0
    node_hacked = 0
    tools = []
    def __init__(self, username, faction):
        self.username = username
        self.faction = faction
        self.network = NetworkModel(self.faction)
        self.ByteCoin = 100
        self.tools = []
        self.node_hacked = 0

    @classmethod
    def recoveredPlayer(self, username, faction, ByteCoin, network, tools, node_hacked) -> 'Player':
        self = Player.__new__(Player)
        self.username = username
        self.faction = faction
        self.ByteCoin = ByteCoin
        self.network = network
        self.tools = tools
        self.node_hacked = node_hacked
        return self

    def getUsername(self):
        return self.username

    def getByteCoin(self):
        return self.ByteCoin

    def getFaction(self):
        return self.faction

    def getNetwork(self):
        return self.network
    def getNetworkString(self):
        for node in self.network.get_nodes():
            print("\nNodo: ",node.name)
            print("IP: ",node.ip)
            print("Tipo: ",node.type)
            print("OS: ",node.os)
            print("Servizi: ",node.services)

    def toString(self):
        return self.username + " " + self.faction + " " + str(self.ByteCoin) + " " + self.getNetworkString() + " " + self.tools
    def getTools(self):
        return self.tools
    def getNodeHacked(self):
        return self.node_hacked

class User:
    def __init__(self, username, email, name, surname):
        self.username = username
        self.email = email
        self.name = name
        self.surname = surname

    def getUsername(self):
        return self.username

    def getEmail(self):
        return self.email

    def getName(self):
        return self.name

    def getSurname(self):
        return self.surname

    def toString(self):
        return self.username + " " + self.email + " " + " " + self.name + " " + self.surname + " "

