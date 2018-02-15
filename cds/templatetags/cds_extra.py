from django import template
import datetime as dt

register = template.Library()

@register.filter
def subtotal(_iter, index):
    def getTD(x):
        return dt.timedelta(hours=x.hour, minutes=x.minute, seconds=x.second)

    _temp = dt.timedelta(hours=0, minutes=0, seconds=0)
    for x in _iter:
        _dt = dt.datetime.strptime(x[int(index)], '%H:%M:%S')
        _temp += getTD(_dt)
    return _temp
