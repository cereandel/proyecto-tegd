from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
db_name = os.getenv('MONGO_DB')
client = MongoClient(os.getenv('MONGO_URL', 'mongodb://localhost:27017'))
db = client[db_name] if db_name else client.get_default_database()