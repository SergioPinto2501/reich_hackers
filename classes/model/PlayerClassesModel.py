class Player:
    def __init__(self, username, faction):
        self.username = username
        self.faction = faction

    def toString(self):
        return self.username + " " + self.faction

    def getUsername(self):
        return self.username

    def getFaction(self):
        return self.faction

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
