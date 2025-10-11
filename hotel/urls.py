from django.urls import path
from . import views

urlpatterns = [
    path('', views.content, name='content'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('reservations/', views.reservations, name='reservations'),
]