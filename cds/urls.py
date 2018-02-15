from django.conf.urls import url

from . import views

app_name = 'cds'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^getProgramData/$', views.getProgramData, name='getProgramData')
]
