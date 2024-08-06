from classes.model.NetworkModel import NetworkModel

class Player:
    username = None
    faction = None
    network = None
    def __init__(self, username, faction):
        self.username = username
        self.faction = faction
        self.network = NetworkModel()

    def toString(self):
        return self.username + " " + self.faction

    def getUsername(self):
        return self.username

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
