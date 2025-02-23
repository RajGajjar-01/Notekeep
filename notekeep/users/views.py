from . import forms
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.core.mail import send_mail


def register_view(request):
    if request.method == 'POST':
        register_form = forms.UserRegistrationForm(request.POST, auto_id=True)
        if register_form.is_valid():
            print(register_form.cleaned_data)
            register_form.save()
            return redirect('user-login')
    else :
        register_form = forms.UserRegistrationForm(auto_id=True)
    
    context = {
        'form' : register_form,
        'title': 'sign up'
    }
    return render(request, 'users/Register.html', context)

def login_view(request):
    if request.method == 'POST':
        login_form = forms.UserLoginForm(request.POST, auto_id=True)
        if login_form.is_valid():
            email = login_form.cleaned_data['email']
            password = login_form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            print(user)
            if user is not None:
                login(request, user)
                messages.success(request, "You have logged in successfully!")
                return redirect('createnotes-home')
            else:
                messages.error(request, "Invalid email or password.")
    else:
        login_form = forms.UserLoginForm(auto_id=True)
    
    context = {
        'form': login_form,
        'title': 'sign in'
    }
    return render(request, 'users/Login.html', context)

def logout_view(request):
    logout(request)
    return redirect('/')

@login_required
def profile_view(request):
    print(request.method)
    if request.method == 'POST':
        u_form = forms.UserUpdateForm(request.POST, instance=request.user)
        p_form = forms.ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)

        print(u_form.is_valid)
        print(p_form.is_valid)
        if u_form.is_valid() and p_form.is_valid() :
            u_form.save()
            p_form.save()
            redirect('/profile')
    else :
        u_form = forms.UserUpdateForm(instance=request.user)
        p_form = forms.ProfileUpdateForm(instance=request.user.profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
        'title' : 'profile'
    }

    return render(request, 'users/Profile.html', context)
