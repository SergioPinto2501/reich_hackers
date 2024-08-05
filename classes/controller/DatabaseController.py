import firebase_admin
import logging
import pyrebase
from firebase_admin import credentials,auth,firestore
from classes.model.PlayerClassesModel import User
from classes.model.PlayerClassesModel import Player
logging.basicConfig(level=logging.DEBUG , format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
class DatabaseController:
    database = None
    auth = None
    firebaseConfig = {
        "apiKey": "AIzaSyDPfdOFZ1RGU4oSRCssM-FoNPmmeN9Le_Q",
        "authDomain": "reich-hackers.firebaseapp.com",
        "projectId": "reich-hackers",
        "storageBucket": "reich-hackers.appspot.com",
        "messagingSenderId": "654597725901",
        "appId": "1:654597725901:web:700456457cfb9582a7d384",
        "measurementId": "G-9L3K0ZP8F3",
        "databaseURL":""
    }
    def __init__(self):
        firebase = pyrebase.initialize_app(self.firebaseConfig)
        self.auth = firebase.auth()
        cred = credentials.Certificate("classes/controller/key_firebase/serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        self.database = firestore.client()


    def registerUser(self, username, email, password, name, surname):
        msg = ""
        try:
            # Register the new user
            self.auth.create_user_with_email_and_password(email, password)
            doc_ref = self.database.collection("users").document(email)
            doc_ref.set({
                "username": username,
                "email": email,
                "name": name,
                "surname": surname
            })
            user = User(username, email, name, surname)
            return user
        except Exception as e:
            msg = f"Errore nella registrazione: {e}"
            return msg

    def loginUser(self, email, password):
        try:
            self.auth.sign_in_with_email_and_password(email, password)
            doc_ref = self.database.collection("users").document(email).get()
            user = User(doc_ref.get("username"), doc_ref.get("email"), doc_ref.get("name"), doc_ref.get("surname"))
            return user
        except Exception as e:
            msg = f"Errore nel login: {e}"
            print(msg)
        return msg


    #Implementare controllo se esiste già una partita con lo stesso giocare, non finita
    def matchmacking(self,player):
        flagPartitaTrovata = False
        doc_ref = self.database.collection("games").get()
        logging.info("Partite in DB: " + str(len(doc_ref)))
        if(len(doc_ref) == 0):
            logging.info("Nessuna partita presente")
            self.createNewGame(player)
        else:
            for i in range(len(doc_ref)):
                if (flagPartitaTrovata == True):
                    break
                logging.info("Controllo partita: " + str(i+1))
                numeroParitita = i+1
                if(self.database.collection("games").document(str(numeroParitita)).get().exists):
                    logging.info("Partita presente")
                    logging.info("Controllo presenza Giocatori")
                    if (self.database.collection("games").document(str(numeroParitita)).collection("players").document("player1").get().exists):
                        logging.info("Giocatore 1 presente")
                        logging.info("Controllo fazione giocatore 1")
                        if (self.database.collection("games").document(str(numeroParitita)).collection("players").document("player1").get().get("faction") == player.getFaction()):
                            logging.info("Giocatore 1 della stessa fazione")
                            logging.info("Posto occupato")
                            continue
                        else:
                            logging.info("Giocatore 1 di fazione diversa")
                            logging.info("Controllo presenza giocatore 2")
                            if (self.database.collection("games").document(str(numeroParitita)).collection("players").document("player2").get().exists):
                                logging.info("Giocatore 2 presente")
                                logging.info("Partita piena")
                            else:
                                logging.info("Giocatore 2 non presente")
                                logging.info("Aggiunta giocatore 2")
                                self.addPlayerToGame(numeroParitita, 2, player)
                                flagPartitaTrovata = True
                    else:
                        logging.info("Giocatore 1 non presente")
                        logging.info("Aggiunta giocatore 1")
                        self.addPlayerToGame(numeroParitita,1, player)
                        flagPartitaTrovata = True
                else:
                    logging.info("Partita" + str(numeroParitita) + " non presente")
                    self.createNewGame(player)
            if (flagPartitaTrovata == False):
                logging.info("Nessuna partita disponibile trovata")
                self.createNewGame(player)


    def createNewGame(self,player):
        logging.info("Creazione nuova partita")
        doc_ref = self.database.collection("games").get()
        numeroParitita = len(doc_ref)+1
        doc_ref = self.database.collection("games").document(str(numeroParitita)).set({
            "gameId": numeroParitita,
            "status": "creating",
            "players": 0
        })
        logging.info("Partita creata con successo")
        self.matchmacking(player)

    def addPlayerToGame(self, gameId, typeofPlayer, player):
        logging.info("Aggiunta giocatore alla partita")
        doc_ref = self.database.collection("games").document(str(gameId)).collection("players").document("player"+str(typeofPlayer)).set({
            "username": player.getUsername(),
            "faction": player.getFaction()
        })
        doc_ref = self.database.collection("games").document(str(gameId)).update({
            "players": typeofPlayer
        })
        if(typeofPlayer == 1):
            doc_ref = self.database.collection("games").document(str(gameId)).update({
                "status": "waiting"
            })
        if(typeofPlayer == 2):
            doc_ref = self.database.collection("games").document(str(gameId)).update({
                "status": "starting"
            })
        logging.info("Giocatore aggiunto con successo")


