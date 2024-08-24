
from flask import Flask,render_template, request, redirect, url_for, flash, session
from flask import make_response
from classes.controller.DatabaseController import DatabaseController
from classes.controller.GameController import GameController
from classes.model.GameModel import GameModel
from classes.model.PlayerClassesModel import Player
from classes.model.PlayerClassesModel import User
from classes.controller.AuthController import AuthController

from classes.MitreAttackAPI import MitreAttackClass
app = Flask(__name__)
app.secret_key='reich_hackers'
auth_Controller = AuthController()

@app.route('/')
def index():
    user = session.get('user')
    return render_template('index.html', user=user)

# This following routes are for the views
@app.route('/registrationView')
def registrationView():
    return render_template('registration_player.html')

@app.route('/loginView')
def loginView():
    return render_template('login_player.html')

@app.route('/homepage_game_allies')
def homepage_game_allies():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'], session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    network_dicts = [node.to_dict() for node in  player.getNetwork().get_nodes()]

    return render_template('vistaAlleati/index.html',player=player, network=network_dicts)
@app.route('/homepage_game_axis')
def homepage_game_axis():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    network_dicts = [node.to_dict() for node in  player.getNetwork().get_nodes()]
    return render_template('vistaAsse/index.html',player=player, network=network_dicts)


# This following routes are for the controllers
@app.route('/registrationController', methods=['POST'])
def registrationController():
    username = request.form.get('username')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    email = request.form.get('email')
    name = request.form.get('name')
    surname = request.form.get('surname')

    if(password != confirm_password):
        flash('Le password inserite non coincidono. Riprova.')
        return redirect(url_for('registrationView'))

    returnValue = auth_Controller.registerUser(username, email, password, name, surname)
    if(isinstance(returnValue, User)):
        session['user'] = returnValue.__dict__
        return redirect(url_for('index'))
    else:
        flash(returnValue)
        return redirect(url_for('registrationView'))


@app.route('/loginController', methods=['POST'])
def loginController():
    email = request.form.get('email')
    password = request.form.get('password')
    returnValue = auth_Controller.loginUser(email, password)
    if(isinstance(returnValue, User)):
        user = User(returnValue.username, returnValue.email, returnValue.name, returnValue.surname)
        print(user.toString())
        session['user'] = returnValue.__dict__
        return redirect(url_for('index'))
    else:
        flash(returnValue)
        return redirect(url_for('loginView'))

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

# Add a new route for the loading page
@app.route('/loading')
def loading():
    return render_template('vistaUtente/loadingView.html')

# Modify the create_game route
@app.route('/create_game', methods=['POST', 'GET'])
def create_game():
    selectedFaction = request.args.get('side')
    session['selectedFaction'] = selectedFaction
    return redirect(url_for('loading'))

@app.route('/inizialization_game')
def perform_backend_operations():
    selectedFaction = session.get('selectedFaction')
    if selectedFaction == "allies":
        selectedFaction = "Alleati"
    elif selectedFaction == "axis":
        selectedFaction = "Asse"
    else:
        print("Errore")

    player = Player(session['user']['username'], selectedFaction)
    game_controller = GameController()
    game = game_controller.matchmacking(player)

    session['game_id'] = game.get_game_id()
    session['faction'] = selectedFaction
    return {'status': 'success'}
@app.route('/check_game_status')
def check_game_status():
    # Recupera l'ID del gioco dalla sessione
    game_id = session.get('game_id')
    if game_id:
        # Crea un'istanza del GameController
        game_controller = GameController()
        # Recupera il documento del gioco usando l'ID del gioco
        doc = game_controller.get_game(game_id)
        if doc:
            # Ottiene lo stato e la fazione dal documento e dalla sessione
            status = doc.get('status')
            faction = session.get('faction')
            # Restituisce una risposta JSON con lo stato e la fazione
            return {'status': status, 'faction': faction}
    # Se l'ID del gioco non esiste o il documento non esiste, restituisce una risposta JSON con stato 'waiting'
    return {'status': 'waiting'}

@app.route('/set_database/<node_name>')
def set_database(node_name):
    print(node_name)
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)

    result = GameController().set_database(game_id, player, node_name)
    print("Esito:" , result)
    if(result):
        return {'status': 'success'}
    else:
        return {'status': 'error'}

@app.route('/game_asse')
def game_asse():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    opponent = GameController().getOpponent(game_id, player)
    network_dicts_player = [node.to_dict() for node in player.getNetwork().get_nodes()]
    network_dicts_opponent = [node.to_dict() for node in opponent.getNetwork().get_nodes()]
    return render_template('vistaAsse/game.html', player=player, network_player=network_dicts_player,network_opponent=network_dicts_opponent)
@app.route('/game_alleati')
def game_alleati():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    opponent = GameController().getOpponent(game_id, player)
    network_dicts_player = [node.to_dict() for node in player.getNetwork().get_nodes()]
    network_dicts_opponent = [node.to_dict() for node in opponent.getNetwork().get_nodes()]
    return render_template('vistaAlleati/game.html',player=player, network_player=network_dicts_player, network_opponent=network_dicts_opponent)

@app.route('/get_node_status/<node_ip>')
def get_node_status(node_ip):
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    node = player.getNetwork().get_node_by_ip(node_ip)
    print("Stato " + str(node.get_name) + str(node.get_status()))
    return {'status': node.get_status()}

#Da vedere come implemnteare la chiamata all'API
@app.route('/mitreattack-api')
def mitreattack_api():
    api = MitreAttackClass()
    technique = api.get_tecnique_by_id("T1003")
    return render_template('mitreattack.html',data=technique)

if __name__ == '__main__':
    app.run(debug=True)


