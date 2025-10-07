from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_handle():
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.getenv('MONGO_DB')
    client = MongoClient(mongo_url)
    db_handle = client[db_name] if db_name else client.get_default_database()
    return db_handle, client