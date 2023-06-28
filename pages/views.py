from django.shortcuts import render


def main_page_view(request):
    return render(request, 'main/main.html')


def redirect_page_view(request, link):
    return render(request, 'redirect/redirect.html')