from django.db import models
from mongo_connection import get_db_handle
# Create your models here.

db_handle, client = get_db_handle()
niggas_collection = db_handle['niggas']