import firebase_admin
import threading
import time
import logging
import pyrebase
from firebase_admin import credentials, auth, firestore
from classes.model.GameModel import GameModel
from classes.controller.DatabaseController import DatabaseController
from classes.model.NetworkModel import NetworkModel
from classes.model.PlayerClassesModel import Player

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class GameController(DatabaseController):
    def get_game_info(self, game_id):
        game_info = self.database.collection("games").document(game_id).get()
        return game_info.to_dict()

    def get_number_of_games(self):
        try:
            games = self.database.collection("games").get()
            return len(games)
        except Exception as e:
            return 0

    def create_game(self, game):
        self.database.collection("games").document(str(game.get_game_id())).set({
            "game_id": game.get_game_id(),
            "status": game.get_status(),
            "number_of_players": 0
        })

    def print_database(self):
        print(self.database)

    def search_game_waiting(self):
        doc_rel = self.database.collection("games").where("status", "==", "waiting").get()
        print(doc_rel)

    def matchmacking(self, player):
        global game
        flagPartitaTrovata = False
        numeroPartita = 0
        status = ""
        doc_ref = self.database.collection("games").get()
        logging.info("Partite in DB: " + str(len(doc_ref)))
        if (len(doc_ref) == 0):
            logging.info("Nessuna partita presente")
            self.createNewGame(player)
        else:
            for i in range(len(doc_ref)):
                if (flagPartitaTrovata == True):
                    break
                logging.info("Controllo partita: " + str(i + 1))
                numeroPartita = i + 1
                if (self.database.collection("games").document(str(numeroPartita)).get().exists):
                    logging.info("Partita presente")
                    logging.info("Controllo presenza Giocatori")
                    if (self.database.collection("games").document(str(numeroPartita)).collection("players").document(
                            "player1").get().exists):
                        logging.info("Giocatore 1 presente")
                        logging.info("Controllo fazione giocatore 1")
                        if (self.database.collection("games").document(str(numeroPartita)).collection(
                                "players").document("player1").get().get("faction") == player.getFaction()):
                            logging.info("Giocatore 1 della stessa fazione")
                            logging.info("Posto occupato")
                        else:
                            logging.info("Giocatore 1 di fazione diversa")
                            logging.info("Controllo presenza giocatore 2")
                            if (self.database.collection("games").document(str(numeroPartita)).collection(
                                    "players").document("player2").get().exists):
                                logging.info("Giocatore 2 presente")
                                logging.info("Partita piena")
                            else:
                                logging.info("Giocatore 2 non presente")
                                logging.info("Aggiunta giocatore 2")
                                self.addPlayerToGame(numeroPartita, 2, player)
                                flagPartitaTrovata = True
                                status = "starting"
                                game = GameModel(numeroPartita, status)
                                break;
                    else:
                        logging.info("Giocatore 1 non presente")
                        logging.info("Aggiunta giocatore 1")
                        self.addPlayerToGame(numeroPartita, 1, player)
                        status = "waiting"
                        game = GameModel(numeroPartita, status)
                        flagPartitaTrovata = True
                        break;
                else:
                    logging.info("Partita" + str(numeroPartita) + " non presente")
                    self.createNewGame(player)
            if (flagPartitaTrovata == False):
                logging.info("Nessuna partita disponibile trovata")
                self.createNewGame(player)

        return game

    def createNewGame(self, player):
        logging.info("Creazione nuova partita")
        doc_ref = self.database.collection("games").get()
        numeroParitita = len(doc_ref) + 1
        doc_ref = self.database.collection("games").document(str(numeroParitita)).set({
            "gameId": numeroParitita,
            "status": "creating",
            "players": 0
        })
        logging.info("Partita creata con successo")
        self.matchmacking(player)

    def addPlayerToGame(self, gameId, typeofPlayer, player):
        logging.info("Aggiunta giocatore alla partita")
        doc_ref = self.database.collection("games").document(str(gameId)).collection("players").document(
            "player" + str(typeofPlayer)).set({
            "username": player.getUsername(),
            "faction": player.getFaction(),
            "ByteCoin": player.getByteCoin()
        })
        nodes = player.getNetwork().get_nodes()
        for node in nodes:
            doc_ref = self.database.collection("games").document(str(gameId)).collection("players").document(
                "player" + str(typeofPlayer)).collection("network").document(node.name).set({
                "name": str(node.name),
                "ip": str(node.ip),
                "type": str(node.type),
                "os": str(node.os),
                "open_ports": str(node.open_ports),
                "services": str(node.services),
                "lat": str(node.lat),
                "lon": str(node.lon),
                "city": str(node.city),
                "status": str(node.status)
            })

        doc_ref = self.database.collection("games").document(str(gameId)).update({
            "players": typeofPlayer
        })
        if (typeofPlayer == 1):
            doc_ref = self.database.collection("games").document(str(gameId)).update({
                "status": "waiting"
            })
        if (typeofPlayer == 2):
            doc_ref = self.database.collection("games").document(str(gameId)).update({
                "status": "starting"
            })
        logging.info("Giocatore aggiunto con successo")

        def get_network_from_player(self, gameId, player):
            doc_ref = self.database.collection("games").document(str(gameId)).collection("players").document(
                player).collection("network").get()
            nodes = []
            for node in doc_ref:
                nodes.append(node)
            return nodes

    def get_game(self, gameId):
        game = self.database.collection("games").document(str(gameId)).get()
        return game.to_dict()

    def getPlayerFromGame(self, gameId, user):
        playerFromDB = self.database.collection("games").document(str(gameId)).collection("players").document("player1").get()
        if (playerFromDB.get("username") == user.getUsername()):
            playerToReturn = playerFromDB
            network = self.database.collection("games").document(str(gameId)).collection("players").document("player1").collection("network").get()
            playerNetwork = NetworkModel.recoverNodes(network)
        else:
            playerFromDB = self.database.collection("games").document(str(gameId)).collection("players").document("player2").get()
            if (playerFromDB.get("username") == user.getUsername()):
                playerToReturn = playerFromDB
                network = self.database.collection("games").document(str(gameId)).collection("players").document("player2").collection("network").get()
                playerNetwork = NetworkModel.recoverNodes(network)

        player = Player.recoveredPlayer(playerToReturn.get("username"), playerToReturn.get("faction"),
                                      playerToReturn.get("ByteCoin"), playerNetwork)


        return player

    def getOpponent(self, gameId, player):
        if (self.database.collection("games").document(str(gameId)).collection("players").document(
                "player1").get().get("username") == player.getUsername()):
            playerType = 2
        else:
            playerType = 1
        playerFromDB = self.database.collection("games").document(str(gameId)).collection("players").document(
            "player" + str(playerType)).get()
        network = self.database.collection("games").document(str(gameId)).collection("players").document(
            "player" + str(playerType)).collection("network").get()
        playerNetwork = NetworkModel.recoverNodes(network)
        print("Nome avversario: ",playerFromDB.get("username"))
        player = Player.recoveredPlayer(playerFromDB.get("username"), playerFromDB.get("faction"),
                                      playerFromDB.get("ByteCoin"), playerNetwork)
        print(player.getUsername())
        print(player.getFaction())
        print(player.getByteCoin())
        print(player.getNetworkString())

        return player

    def set_database(self, game_id, player, node_name):

        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2

        doc_ref = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("network").document(node_name).update({
            "main": True
        })
        self.database.collection("games").document(str(game_id)).update({
            "status": "in game"
        })
        print("Node " + node_name + " set as main")
        return True
