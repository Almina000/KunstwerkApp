import time

from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set-profile', methods=['POST'])
def print_profile():
    form = request.form
    print(form['profile'])
    time.sleep(15)
    return render_template('success.html')

@app.route('/artwork')
def artwork():
    return render_template('artwork.html')

@app.route('/choose-algorithm')
def choose_algorithm():
    return render_template('chooseAlgorithm.html')

@app.route('/choose-profile')
def choose_profile():
    return render_template('chooseProfile.html')

@app.route('/choose-data')
def choose_data():
    return render_template('chooseData.html')

@app.route('/delaunay/random')
def delaunay_random():
    return render_template('delaunay_random.html')

@app.route('/delaunay/häufigkeit')
def delaunay_haeufigkeit():
    return render_template('delaunay_haeufigkeit.html')

# @app.route('/delaunay')
# def delaunay():
#     return render_template('delaunay.html')

@app.route('/delaunay-auswahl')
def delaunay_auswahl():
    return render_template('delaunayAuswahl.html')

@app.route('/fibonacci')
def fibonacci():
    return render_template('fibonacci.html')

@app.route('/voronoi')
def voronoi():
    return render_template('voronoi.html')

@app.route('/weighted-voronoi')
def weighted_voronoi():
    return render_template('weightedVoronoi.html')

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/test')
def do_thing():
    return render_template('input.html')
