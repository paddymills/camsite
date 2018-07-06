from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template('fabinstructions/index.html')
    context = {
        'css': ['fabinstructions/main.css'],
        'js': ['jquery-3.2.1.min.js'],
        'title': 'FI | dev'
    }
    return HttpResponse(template.render(context, request))

def dev(request):
    template = loader.get_template('dev_page.html')
    return HttpResponse(template.render(dict(name='Fab Instr'), request))
