import firebase_admin
import logging
import pyrebase
from firebase_admin import credentials,auth,firestore
from classes.model.Vulnerability import Vulnerability
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

    def get_vulerability_info(self, name):
        exploits = {}
        vulnerability = self.database.collection('vulnerabilities').document(name).get()
        exploitsDB = self.database.collection('vulnerabilities').document(name).collection('exploits').get()


        if not vulnerability.exists:
            return None
        else:
            for exploit in exploitsDB:
                exploits[exploit.get("exploit_title")] = exploit.get("path")

            return Vulnerability(vulnerability.get('nome'), vulnerability.get('descrizione'), vulnerability.get('CVE'), vulnerability.get('CVE_descrizione'), exploits)