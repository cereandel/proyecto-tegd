from django import forms

class SignupForm(forms.Form):
    username = forms.CharField(label='Usuario', max_length=150)
    email = forms.EmailField(label='Correo electrónico')
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput)

class LoginForm(forms.Form):
    username = forms.CharField(label='Usuario', max_length=150)
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput)
