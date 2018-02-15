from django.http import HttpResponse
from django.template import loader

import pyodbc
import json
import time

cs = 'DRIVER={SQL Server};SERVER=W7850\\SIGMANEST;DATABASE=SNDBase91'

def index(request):
    conn = pyodbc.connect(cs)
    cur = conn.cursor()
    cur.execute("""
        SELECT DISTINCT
        Program.MachineName,
        Program.ProgramName,
        Stock.Thickness,
        Program.CuttingTime
        FROM Program
        INNER JOIN Stock ON Program.SheetName = Stock.SheetName
        WHERE Program.MachineName IN ('MG_OXY_GLOBAL', 'MG_TITAN_GLOBAL', 'Gemini')
        ORDER BY Program.ProgramName
    """)

    matches = {
        'MG_OXY_GLOBAL': 'MG Oxy',
        'MG_TITAN_GLOBAL': 'MG Titan',
        'Gemini': 'Gemini'
    }
    _data = {x: [] for x in matches.values()}
    for mach, *_temp in cur.fetchall():
        _temp[-1] = time.strftime("%H:%M:%S", time.gmtime(_temp[-1]))
        _data[matches[mach]].append(_temp)
    conn.close()

    template = loader.get_template('cds/index.html')
    context = {
        'ls': _data,
        'head': ['Program', 'Thickness', 'Run Time'],
        'css': ['cds/main.css'],
        'js': ['jquery-3.2.1.min.js', 'cds/programdata.js']
    }
    return HttpResponse(template.render(context, request))


def getProgramData(request):
    program = request.GET.get('program')

    conn = pyodbc.connect(cs)
    cur = conn.cursor()
    cur.execute("""
        SELECT PIP.PartName, PIP.QtyInProcess, Part.Data1, Part.Data2
        FROM Part
        INNER JOIN PIP ON PIP.PartName = Part.PartName
        WHERE PIP.ProgramName = ?
        ORDER BY Part.PartName
    """, program)

    _temp = [[str(y) for y in x] for x in cur.fetchall()]
    conn.close()

    return HttpResponse(
        loader.render_to_string('cds/programData.html', {
            'ls': _temp,
            'head': ['Part', 'Qty', 'Job', 'Shipment']
        })
    )
