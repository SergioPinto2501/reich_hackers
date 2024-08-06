import firebase_admin
import logging
import pyrebase
from firebase_admin import credentials,auth,firestore
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
        "databaseURL": ""
    }

    def __init__(self):
        firebase = pyrebase.initialize_app(self.firebaseConfig)
        self.auth = firebase.auth()
        if not firebase_admin._apps:
            cred = credentials.Certificate("classes/controller/key_firebase/serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
        self.database = firestore.client()

    def get_database(self):
        print(self.database)
        return self.database

    def get_auth(self):
        return self.auth