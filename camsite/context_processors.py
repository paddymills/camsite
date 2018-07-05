from django.apps import apps, AppConfig

def apps_config(request):
    ls = []
    for app in apps.get_app_configs():
        if app.name[:7] != 'django.':
            ls.append([app.name, app.verbose_name])
    return {'APPS': ls}
