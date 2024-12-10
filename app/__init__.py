from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session, jsonify
from flask_cors import CORS
import os
import subprocess
import threading


app = Flask(__name__)
CORS(app)
#app.secret_key = '12345asdfgHHHr45JK!'  # Ersetze dies durch einen sicheren, zufälligen Schlüssel
app.secret_key = os.urandom(24)

# Mock: Status des Scrapers (dieser sollte dynamisch geändert werden)
scraper_status = {"status": "running"}  # "running" oder "completed"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/js/images.json')
def serve_json():
    return send_from_directory('static/js', 'images.json')

@app.route('/generate-images-json')
def generate_images_json():
    profile_name = session.get('profile_name')

    if not profile_name:
        print('Profilname fehlt in der Session.')
        return jsonify({'error': 'Profilname fehlt'}), 400

    script_path = os.path.join(os.path.dirname(__file__), 'static/js/readImages.js')
    print(f'Script wird ausgeführt: {script_path}')

    result = subprocess.run(['node', script_path, profile_name], capture_output=True, text=True)

    if result.returncode == 0:
        print('Script readImages.js wurde erfolgreich ausgeführt.')
        print(f'Script-Ausgabe: {result.stdout}')
        #return render_template('waitingPixels.html')
    else:
        print(f'Script readImages.js wurde mit einem Fehler beendet. Rückgabecode: {result.returncode}')
        print(f'Script-Fehlerausgabe: {result.stderr}')
        #return jsonify({'error': 'Fehler beim Ausführen von readImages.js', 'details': result.stderr}), 500
    # return render_template('waitingPixels.html')
    response = waiting_pixels()
    return response

   

@app.route('/read-images-json', methods=['POST'])
def read_images_json():
    print('Hej I bims ich bin an der richtigen stelle')
    form = request.form
    profile = form.get('profile')

    if not profile:
        return jsonify({"error": "Profilname fehlt"}), 400
    
    # Speichere den Profilnamen in der Sitzung
    session['profile_name'] = profile

    def run_scraper(profile_name):
        # Übergib den Profilnamen an scraperRun.py
        script_path = os.path.join(os.path.dirname(__file__), 'readPixelsFromJson.py')
        subprocess.run(['python', script_path, profile_name])
        global scraper_status
        scraper_status['finished'] = True

    # Führe den Scraper in einem separaten Thread aus, um die HTTP-Anfrage nicht zu blockieren
    thread = threading.Thread(target=run_scraper, args=(profile,))
    thread.start()

    response = choose_algorithm()

    return response

@app.route('/waiting-pixels')
def waiting_pixels():
    return render_template('waitingPixels.html')



#######################################
#SCRAPER
@app.route('/set-profile', methods=['POST'])
def print_profile():
    form = request.form
    profile = form.get('profile')

    if not profile:
        return jsonify({"error": "Profilname fehlt"}), 400
    
     
    # Speichere den Profilnamen in der Sitzung
    session['profile_name'] = profile

    def run_scraper(profile_name):
        # Übergib den Profilnamen an scraperRun.py
        script_path = os.path.join(os.path.dirname(__file__), 'scraperRun.py')
        subprocess.run(['python', script_path, profile_name])
        global scraper_status
        scraper_status['finished'] = True

    # Führe den Scraper in einem separaten Thread aus, um die HTTP-Anfrage nicht zu blockieren
    thread = threading.Thread(target=run_scraper, args=(profile,))
    thread.start()

    return render_template('waiting.html')

    # Verwende die Session-Variable direkt für die Weiterleitung
    #return redirect(url_for('choose_data', profile=session['profile_name']))


# @app.route('/scraper_status')
# def scraper_status_endpoint():
#     # Status als JSON zurückgeben
#     return jsonify(scraper_status)

@app.route('/check_scraper_status')
def check_scraper_status():
    return jsonify(scraper_status)

# # Beispiel: Scraper abschließen
# @app.route('/complete_scraper')
# def complete_scraper():
#     global scraper_status
#     scraper_status["status"] = "completed"
#     return "Scraper abgeschlossen"

#######################################################################################################################


@app.route('/artwork')
def artwork():
    #return render_template('artwork.html')
    profile_name = request.args.get('profile', 'default')
    data_name = request.args.get('data', 'default')
    return render_template('artwork.html', profile=profile_name, data=data_name)

@app.route('/choose-algorithm')
def choose_algorithm():
    # Versuche, den Datennamen aus der URL zu holen
    data_name = request.args.get('data')

    # Wenn kein Datennamen in der URL vorhanden ist, versuche, ihn aus der Session zu holen
    if not data_name:
        data_name = session.get('data_name', 'default')

    # Falls immer noch kein Datennamen vorhanden ist, setze ihn auf "default"
    if not data_name:
        data_name = 'default'

    # Versuche, den Profilnamen aus der URL zu holen
    profile_name = request.args.get('profile', 'default')
    
    # Speichere den Profilnamen und Datennamen in der Sitzung
    session['data_name'] = data_name
    session['profile_name'] = profile_name

    print(f"Data Name in Flask: {data_name}")
    print(f"Data Name: {data_name}, Profile Name: {profile_name}")

    return render_template('chooseAlgorithm.html', profile=profile_name, data=data_name)

   



@app.route('/choose-profile')
def choose_profile():
    return render_template('chooseProfile.html')

@app.route('/choose-data')
def choose_data():
    # Versuche, den Profilnamen aus der URL zu holen
    profile_name = request.args.get('profile')

    # Wenn kein Profilname in der URL vorhanden ist, versuche, ihn aus der Session zu holen
    if not profile_name:
        profile_name = session.get('profile_name', 'default')

    # Falls immer noch kein Profilname vorhanden ist, setze ihn auf "default"
    if not profile_name:
        profile_name = 'default'

    # Speichere den Profilnamen in der Sitzung
    session['profile_name'] = profile_name

    return render_template('chooseData.html', profile=profile_name)


@app.route('/delaunay/random')
def delaunay_random():
    profile_name = session.get('profile_name', 'default')
    data_name = session.get('data_name', 'default')
    return render_template('delaunay_random.html', profile=profile_name, data=data_name)

@app.route('/delaunay/häufigkeit')
def delaunay_haeufigkeit():
    profile_name = session.get('profile_name', 'default')
    data_name = session.get('data_name', 'default')
    return render_template('delaunay_haeufigkeit.html', profile=profile_name, data=data_name)

# @app.route('/delaunay')
# def delaunay():
#     return render_template('delaunay.html')

@app.route('/delaunay-auswahl')
def delaunay_auswahl():
    profile_name = session.get('profile_name', 'default')
    data_name = session.get('data_name', 'default')  # Hole den Profilnamen aus der Session oder setze einen Standardwert
    return render_template('delaunayAuswahl.html', profile=profile_name, data=data_name)

@app.route('/fibonacci')
def fibonacci():
    profile_name = session.get('profile_name', 'default')
    data_name = session.get('data_name', 'default')  # Hole den Profilnamen aus der Session oder setze einen Standardwert
    return render_template('fibonacci.html', profile=profile_name, data=data_name)

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

