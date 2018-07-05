from django.shortcuts import render
from django.http import HttpResponseRedirect


def landingpage(request):
    return HttpResponseRedirect('/index/')

def index(request):
    context = {
        'title': 'CAD/CAM Site',
        'links': [
            ('cds', 'Detail Bay Nests'),
            ('fabinstructions', 'Fabrication Instructions Form'),
            ('extras', 'Remakes & Extras'),
        ]
    }

    return render(request, 'index.html', context)
