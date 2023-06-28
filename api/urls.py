from django.urls import path

from .views import CreateLink, GetLink

app_name = 'api'

urlpatterns = [
    path('create', CreateLink.as_view()),
    path('get', GetLink.as_view())
]