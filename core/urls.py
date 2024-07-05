from django.urls import path

from .views import home, podcast_view


urlpatterns = [
        path("", home, name="home"),
        path("podcasts/<slug>", podcast_view, name="podcast"),
    ]
