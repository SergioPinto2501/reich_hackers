import firebase_admin
import os
import pyrebase
from firebase_admin import credentials,auth,firestore
from classes.model.PlayerClasses import User
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







