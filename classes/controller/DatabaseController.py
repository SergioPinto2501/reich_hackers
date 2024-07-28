import firebase_admin
import os
from firebase_admin import credentials,auth,firestore
class DatabaseController:
    database = None
    auth = None
    def __init__(self):
        cred = credentials.Certificate("classes/controller/key_firebase/serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        self.database = firestore.client()
        self.auth = auth

    def getCollections(self):
        return firestore.client().collections()





