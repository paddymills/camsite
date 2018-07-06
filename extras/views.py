from django.http import HttpResponse
from django.template import loader

from . import models


# Create your views here.
def index(request):
    f = models.ExtraForm(auto_id=False)


    template = loader.get_template('extras/index.html')
    context = {
        'css': ['extras/main.css'],
        'js': ['extras/sketch.js'],
        'title': 'Remakes & Extras',
        'forms': [
            models.ExtraForm(auto_id=False).as_p(),
        ],
    }
    return HttpResponse(template.render(context, request))
