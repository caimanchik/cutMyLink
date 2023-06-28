from django.urls import path

from pages.views import main_page_view, redirect_page_view

app_name = 'pages'

urlpatterns = [
    path('', main_page_view),
    path('<str:link>', redirect_page_view)
]