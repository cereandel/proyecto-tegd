from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

def landing(request):
    return render(request, 'hotel/landing.html')

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'hotel/signup.html', {'form': form})

def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)
            return redirect('reservations')
    else:
        form = AuthenticationForm()
    return render(request, 'hotel/login.html', {'form': form})

def reservations(request):
    # Example: fetch reservations and recommendations for the logged-in user
    reservations = []  # Replace with actual query
    recommendations = []  # Replace with actual recommendation logic
    return render(request, 'hotel/reservations.html', {
        'reservations': reservations,
        'recommendations': recommendations
    })