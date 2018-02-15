from django.shortcuts import render
from django.http import HttpResponseRedirect


def landingpage(request):
    return HttpResponseRedirect('/index/')

def index(request):
    context = {
        'title': 'CAD/CAM Site',
        'links': [
            ('cds', 'Code Delivery System'),
            ('fabinstructions', 'Fabrication Instructions Form'),
        ]
    }

    return render(request, 'index.html', context)
