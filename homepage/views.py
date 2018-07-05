from django.shortcuts import render
from django.http import HttpResponseRedirect


def landingpage(request):
    return HttpResponseRedirect('/index/')

def index(request):
    context = {
        'title': 'CAD/CAM Site',
    }

    return render(request, 'index.html', context)
