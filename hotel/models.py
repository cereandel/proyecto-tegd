from django.db import models
from mongo_connection import db

user_collection = db['users']