from django.shortcuts import render
from .models import user_collection
from .forms import SignupForm, LoginForm

def content(request):
    return render(request, 'hotel/content.html')

def landing(request):
    return render(request, 'hotel/landing.html')


def signup(request):
    message = ''
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            if user_collection.find_one({'username': username}):
                form.add_error('username', 'El usuario ya existe.')
            else:
                user_collection.insert_one({
                    'username': username,
                    'password': password,
                    'email': email
                })
                message = 'Registro exitoso.'
    else:
        form = SignupForm()
    return render(request, 'hotel/signup.html', {'form': form, 'message': message})


def login(request):
    message = ''
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = user_collection.find_one({'username': username, 'password': password})
            if user:
                message = 'Login exitoso.'
            else:
                form.add_error(None, 'Usuario o contraseña incorrectos.')
    else:
        form = LoginForm()
    return render(request, 'hotel/login.html', {'form': form, 'message': message})


def reservations(request):
    reservations = []
    recommendations = []
    return render(request, 'hotel/reservations.html', {
        'reservations': reservations,
        'recommendations': recommendations
    })