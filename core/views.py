from django.shortcuts import render


# Create your views here.
def home(request):
    return render(request, "home.html", {})


def podcast_view(request, slug):
    return render(request, "podcasts/index.html")