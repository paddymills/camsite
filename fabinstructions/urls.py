from django.conf.urls import url

from . import views

app_name = 'fabinstructions'
urlpatterns = [
    url(r'^$', views.index, name='index'),
]
