from django.conf.urls import url

from . import views

app_name = 'homepage'
urlpatterns = [
    url(r'^$', views.landingpage, name='index redirect'),
    url(r'^index/$', views.index, name='index'),
]
