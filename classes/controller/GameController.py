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
            "ByteCoin": player.getByteCoin(),
            "node_hacked": player.getNodeHacked()
        })
        doc_ref = self.database.collection("games").document(str(gameId)).collection("players").document(
            "player" + str(typeofPlayer)).collection("tools")
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
                "status": str(node.status),
                "employeeName": str(node.employeeName),
                "employeeSurname": str(node.employeeSurname),
                "email": str(node.email),
                "password": str(node.password),
                "token": str(node.token),
                "phishing_index": str(node.phishing_index)
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
        playerTools = []
        playerFromDB = self.database.collection("games").document(str(gameId)).collection("players").document("player1").get()
        if (playerFromDB.get("username") == user.getUsername()):
            playerToReturn = playerFromDB
            network = self.database.collection("games").document(str(gameId)).collection("players").document("player1").collection("network").get()
            playerNetwork = NetworkModel.recoverNodes(network)
            tools = self.database.collection("games").document(str(gameId)).collection("players").document("player1").collection("tools").get()
            for tool in tools:
                playerTools.append(tool.get("name"))
        else:
            playerFromDB = self.database.collection("games").document(str(gameId)).collection("players").document("player2").get()
            if (playerFromDB.get("username") == user.getUsername()):
                playerToReturn = playerFromDB
                network = self.database.collection("games").document(str(gameId)).collection("players").document("player2").collection("network").get()
                playerNetwork = NetworkModel.recoverNodes(network)
                tools = self.database.collection("games").document(str(gameId)).collection("players").document("player2").collection("tools").get()
                for tool in tools:
                    playerTools.append(tool.get("name"))
        player = Player.recoveredPlayer(playerToReturn.get("username"), playerToReturn.get("faction"),
                                      playerToReturn.get("ByteCoin"), playerNetwork, playerTools, playerToReturn.get("node_hacked"))


        return player

    def getOpponent(self, gameId, player):
        playerTools = []
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
        tools = self.database.collection("games").document(str(gameId)).collection("players").document("player" + str(playerType)).collection("tools").get()
        for tool in tools:
            playerTools.append(tool.get("name"))
        player = Player.recoveredPlayer(playerFromDB.get("username"), playerFromDB.get("faction"),
                                      playerFromDB.get("ByteCoin"), playerNetwork,playerTools, playerFromDB.get("node_hacked"))

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

    def add_tool(self, game_id, player, tool):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2

        doc_ref = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("tools").document(tool["name"]).set({
            "name": tool["name"],
            "description": tool["description"]
        })
        self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).update({
            "ByteCoin": player.getByteCoin() - 10
        })
        print("Tool " + tool['name'] + " added")
        return True

    def check_tool(self, game_id, player, tool):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2

        if(self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("tools").document(tool).get().exists):
            return False
        else:
            return True

    def get_tool_description(self, game_id, player, tool):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        tool = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("tools").document(tool).get(["description"])
        return tool.get("description")

    def send_email(self, game_id, player, email_info):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        emails = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("send_emails").get()
        n_emails = len(emails)
        self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("send_emails").document(str(n_emails + 1)).set({
            "from": email_info["sender"],
            "to": email_info["receiver"],
            "subject": email_info["subject"],
            "body": email_info["message"]
        })
        opponent = self.getOpponent(game_id, player)
        if(playerType == 1):
            opponentType = 2
        else:
            opponentType = 1

        result = opponent.getNetwork().check_if_exist_person(email_info["receiver"])
        if(result):
            n_recivedMail = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(opponentType)).collection("received_emails").get()
            n_recivedMail = len(n_recivedMail)
            self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(opponentType)).collection("received_emails").document(str(n_recivedMail + 1)).set({
                "from": email_info["sender"],
                "to": email_info["receiver"],
                "subject": email_info["subject"],
                "body": email_info["message"]
            })
        return True

    def get_send_email(self, game_id, player):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        emails = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("send_emails").get()
        emails_list = []
        for email in emails:
            emails_list.append(email.to_dict())
        return emails_list

    def get_received_email(self, game_id, player):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        emails = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("received_emails").get()
        emails_list = []
        for email in emails:
            emails_list.append(email.to_dict())
        return emails_list

    def get_token_from_phishing(self, game_id, player, opponent):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == opponent.getUsername()):
            opponentType = 1
        else:
            opponentType = 2
        email_send_by_player = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("send_emails").get()
        email_recived_by_opponent = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(opponentType)).collection("received_emails").get()
        print("Email inviate:")
        for email in email_send_by_player:
            print(email.to_dict())
        print("Email ricevute:")
        for email in email_recived_by_opponent:
            print(email.to_dict())
        print(email_recived_by_opponent)
        email_which_take_token = []
        for email_send in email_send_by_player:
            for email_opponent in email_recived_by_opponent:
                if email_send.get("to") == email_opponent.get("to"):
                    email_which_take_token.append(email_send.get("to"))

        return email_which_take_token;

    def check_token(self,game_id, player, opponent, token):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == opponent.getUsername()):
            opponentType = 1
        else:
            opponentType = 2
        opponent_network = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(opponentType)).collection("network").get()
        for node in opponent_network:
            if node.get("token") == token:
                if(node.get("status") != "Compromised"):
                    if(node.get("type") == 'Database'):
                        try:
                            status_db = node.get("main")
                        except:
                            status_db = False
                        if(status_db == True):
                            node_hacked = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).get().get("node_hacked")
                            self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).update({
                                "ByteCoin": player.getByteCoin() + 10,
                                "node_hacked": node_hacked + 1
                            })
                            self.database.collection("games").document(str(game_id)).collection("players").document(
                                "player" + str(opponentType)).collection("network").document(node.get("name")).update({
                                "status": "Compromised"
                            })
                            return True
                        else:
                            node_hacked = self.database.collection("games").document(str(game_id)).collection(
                                "players").document("player" + str(playerType)).get().get("node_hacked")
                            self.database.collection("games").document(str(game_id)).collection("players").document(
                                "player" + str(playerType)).update({
                                "ByteCoin": player.getByteCoin() + 10,
                                "node_hacked": node_hacked + 1
                            })
                            self.database.collection("games").document(str(game_id)).collection("players").document(
                                "player" + str(opponentType)).collection("network").document(node.get("name")).update({
                                "status": "Compromised"
                            })
                    else:
                        node_hacked = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).get().get("node_hacked")
                        self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).update({
                            "ByteCoin": player.getByteCoin() + 10,
                            "node_hacked": node_hacked + 1
                        })
                        self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(opponentType)).collection("network").document(node.get("name")).update({
                            "status": "Compromised"
                        })
                        return False
    def exploit(self,game_id,player,opponent,target):
        ip = target.get("target_ip")
        ip = self.remove_trailing_space(ip)

        port = target.get("target_port")
        port = self.remove_trailing_space(port)

        service = target.get("service")
        service = self.remove_trailing_space(service)

        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == opponent.getUsername()):
            opponentType = 1
        else:
            opponentType = 2
        opponent_network = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(opponentType)).collection("network").get()
        for node in opponent_network:
            if node.get("ip") == ip:
                open_ports = node.get("open_ports")
                if port in open_ports:
                    services = node.get("services")
                    if service in services:
                        token = node.get("token")

        return token

    def end_game(self, game_id, player):
        self.database.collection("games").document(str(game_id)).set({
            "game_id": game_id,
            "status": "end",
            "winner": player.getUsername()
        })
        return True


    def remove_trailing_space(self, s):
        if s.endswith(' '):
            s = s[:-1]
        return s

    def check_game_status(self, game_id):
        status = self.database.collection("games").document(str(game_id)).get().get("status")
        return status

    def get_game_winner(self, game_id):
        winner = self.database.collection("games").document(str(game_id)).get().get("winner")
        return winner

    def repair_vulnerabilities(self,game_id,player,vulnerabilities):
        node_name = vulnerabilities.get("name")
        node_ip = vulnerabilities.get("ip")
        node_old_service = vulnerabilities.get("services")
        node_new_service = vulnerabilities.get("servicesFixit")
        print(node_old_service[0]['port'])
        print(node_old_service[0]['service'])
        print(node_new_service[0]['service'])
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2

        node = self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("network").document(node_name).get()
        if(node.get("ip") == node_ip):
            if(node_old_service[0]['port'] in node.get("open_ports")):
               if(node_old_service[0]['service'] in node.get("services")):
                   actual_services = node.get("services")
                   actual_services = actual_services[1:-1]

                   services_array = [service.strip().replace("'", "") for service in actual_services.split(',')]
                   services_dict = {int(service.split(':')[0]): service.split(':')[1].lstrip() for service in services_array}

                   for key in services_dict:
                       if key == int(node_old_service[0]['port']):
                           services_dict[key] = node_new_service[0]['service']
                   self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).collection("network").document(node_name).update({
                          "services": str(services_dict)
                   })
                   self.database.collection("games").document(str(game_id)).collection("players").document("player" + str(playerType)).update({
                          "ByteCoin": player.getByteCoin() - 40
                     })
                   return True
               else:
                   return False
            else:
                return False
        else:
            return False

    def leave_game(self,game_id,player):
        if(self.database.collection("games").document(str(game_id)).collection("players").document("player1").get().get("username") == player.getUsername()):
            playerType = 1
        else:
            playerType = 2
        opponent = self.getOpponent(game_id, player)
        self.database.collection("games").document(str(game_id)).update({
            "status": "abandoned",
            "winner": opponent.getUsername()
        })
        return True


