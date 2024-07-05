from typing import Any
from django.shortcuts import render
from django.views.generic import TemplateView
from .forms import LoginForm


# Create your views here.
class LoginView(TemplateView):
    form_class = LoginForm
    template_name = "accounts/authentication/login.html"
    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['form'] = self.form_class()
        return context
    
class RegisterView(TemplateView):
    template_name = "accounts/authentication/register.html"


class OtpView(TemplateView):
    template_name = "accounts/authentication/otp.html"

class ProfileView(TemplateView):
    template_name = "accounts/profile.html"
