from django.shortcuts import render
from .models import niggas_collection
from django.http import HttpResponse
# Create your views here.


def index(request):
    return HttpResponse("<h1>app is being attacked by n words</h1>")

def add_nigga(request):
    records = {
        "first_name":"jamal",
        "last_name": "quantavious"
    }
    niggas_collection.insert_one(records)
    return HttpResponse("new nigga has been added")

def get_all_niggas(request):
    niggas = niggas_collection.find()
    return (niggas)