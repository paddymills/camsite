from django.db import models
from django import forms

# Create your models here.
class ExtraForm(forms.Form):
    part = forms.CharField()
    rect = forms.BooleanField()
    width = forms.FloatField()
    length = forms.FloatField()
