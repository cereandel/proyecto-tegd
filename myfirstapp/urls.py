from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('add/', views.add_nigga),
    path('show/', views.get_all_niggas)
]