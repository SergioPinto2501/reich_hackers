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
