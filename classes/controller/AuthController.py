import firebase_admin
import logging
import pyrebase
from firebase_admin import credentials,auth,firestore
from classes.controller.DatabaseController import DatabaseController
from classes.model.PlayerClassesModel import User
from classes.model.GameModel import GameModel
from classes.model.PlayerClassesModel import Player
logging.basicConfig(level=logging.DEBUG , format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
class AuthController(DatabaseController):

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

