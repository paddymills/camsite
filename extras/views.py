from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template('extras/index.html')
    context = {
        'css': ['extras/main.css'],
        'js': ['jquery-3.2.1.min.js'],
        'title': r'Remakes\Extras'
    }
    return HttpResponse(template.render(context, request))
