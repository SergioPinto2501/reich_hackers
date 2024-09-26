
from flask import Flask,render_template, request, redirect, url_for, flash, session
from flask import make_response
from classes.controller.DatabaseController import DatabaseController
from classes.controller.GameController import GameController
from classes.model.PlayerClassesModel import Player
from classes.model.PlayerClassesModel import User
from classes.controller.AuthController import AuthController
from classes.model.Vulnerability import Vulnerability

app = Flask(__name__)
app.secret_key='reich_hackers'
auth_Controller = AuthController()

@app.route('/')
def index():
    session.pop('game_id', None)
    session.pop('faction', None)
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

@app.route('/get_tools_list')
def get_tools():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    return {'tools': player.getTools()}
@app.route('/get_node_status/<node_ip>')
def get_node_status(node_ip):
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    node = player.getNetwork().get_node_by_ip(node_ip)
    if(node == None):
        opponent = GameController().getOpponent(game_id, player)
        node = opponent.getNetwork().get_node_by_ip(node_ip)
    if(node == None):
        return {'status': 'null'}
    else:
        return {'status': node.get_status()}

@app.route('/get_tool_description/<tool>')
def get_tool_description(tool):
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    description = GameController().get_tool_description(game_id, player, tool)
    return {'description': description}
@app.route('/check_tool/<tool>')
def check_tool(tool):
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    result = GameController().check_tool(game_id, player, tool)
    if(result):
        return {'status': 'success'}
    else:
        return {'status': 'error'}
@app.route('/add_tool/', methods=['POST'])
def add_tool():
    tool = request.get_json()
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)

    if(player.getByteCoin()<10):
        return {'status': 'error'}
    else:
        result = GameController().add_tool(game_id, player, tool)
        if(result):
            return {'status': 'success'}
        else:
            return {'status': 'error'}

@app.route('/get_node_info/<node_ip>')
def get_node_info(node_ip):
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    node = player.getNetwork().get_node_by_ip(node_ip)
    if(node == None):
        opponent = GameController().getOpponent(game_id, player)
        node = opponent.getNetwork().get_node_by_ip(node_ip)
    if(node == None):
        return {'node': 'null'}
    else:
        return {'node': node.to_dict()}
@app.route('/get_vulnerability_info/<service>', methods=['GET'])
def get_vulnerability_info(service):
    vulnerability = DatabaseController().get_vulerability_info(service)
    if isinstance(vulnerability, Vulnerability):
        return {'vulnerability': vulnerability.to_dict()}
    else:
        return {'vulnerability': 'null'}
@app.route('/get_information_about_person/<node_ip>')
def get_person_name(node_ip):
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    node = player.getNetwork().get_node_by_ip(node_ip)
    if(node == None):
        opponent = GameController().getOpponent(game_id, player)
        node = opponent.getNetwork().get_node_by_ip(node_ip)
        if(node == None):
            return {'information': 'null'}
        else:
            node_info = [node.get_employee_surname(), node.get_employee_name(), node.get_email()]
            return {'information': node_info}
    else:
        node_info = [node.get_employee_name(), node.get_employee_surname(), node.get_email()]
        return {'information': node_info}
@app.route('/get_exploit_info/<service>')
def get_exploit_info(service):
    vulnerability = DatabaseController().get_vulerability_info(service)
    if isinstance(vulnerability, Vulnerability):
        return {'exploits': vulnerability.get_exploits()}
    else:
        return {'exploits': 'null'}
@app.route('/send_email/', methods=['POST'])
def send_emails():
    emails_information= request.get_json()
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    sender = emails_information['emailSender']
    subject = emails_information['subject']
    message = emails_information['body']
    ricevers = emails_information['email']
    i=0
    result = {}
    email_info = {}
    for reciver in ricevers:
        email_info['receiver'] = reciver
        email_info['sender'] = sender
        email_info['subject'] = subject
        email_info['message'] = message
        result[i] = GameController().send_email(game_id, player, email_info)
        i+=1

    if True in result:
        return {'status': 'success'}
    else:
        if result:
            return {'status': 'success'}
        else:
            return {'status': 'error'}
@app.route('/get_send_emails/')
def get_send_emails():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    emails = GameController().get_send_email(game_id, player)
    return {'emails': emails}

@app.route("/get_token_from_phishing/")
def get_token_from_phishing():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    opponent = GameController().getOpponent(game_id, player)
    email_which_take_token = GameController().get_token_from_phishing(game_id, player, opponent)
    information = {}
    index = 0
    for node in opponent.getNetwork().get_nodes():
        if node.get_email() in email_which_take_token:
            if node.get_phishing_index() > 2:
                information[index] = [
                    node.get_employee_name(),
                    node.get_employee_surname(),
                    node.get_email(),
                    node.get_token()
                ]
                index+=1

    return {'info': information}

@app.route('/get_received_emails/')
def get_received_emails():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    emails = GameController().get_received_email(game_id, player)

    return {'emails': emails}

@app.route('/check_token/', methods=['POST'])
def check_token():
    token = request.form.get('token')

    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    opponent = GameController().getOpponent(game_id, player)
    result = GameController().check_token(game_id, player, opponent, token)

    if(result):
        return render_template('vistaUtente/victory.html', player=player)
    else:
        if player.getFaction() == "Asse":
            return redirect(url_for('game_asse'))
        else:
            return redirect(url_for('game_alleati'))

@app.route('/exploit/', methods=['POST'])
def exploit():
    target = request.get_json()
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    oppenent = GameController().getOpponent(game_id, player)
    token = ""
    try:
        token = GameController().exploit(game_id, player, oppenent, target)
    except:
        token = ""
    if(token != ""):
        return {'token': token}
    else:
        return {'token': 'error'}

@app.route('/get_game_status/')
def get_game_status():
    print("Richiesta status")
    game_id = session.get('game_id')
    player = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    status = GameController().check_game_status(game_id)
    if(status == "end"):
        winner = GameController().get_game_winner(game_id)
        print("Stato: ", status)
        print("Vincitore: ", winner)
        return {'status': 'end', 'winner': winner}
    elif status == "abandoned" :
        winner = GameController().get_game_winner(game_id)
        print("Stato: ", status)
        print("Vincitore: ", winner)
        return {'status': status, 'winner': winner}
    else:
        return {'status': status}


@app.route('/end_game/')
def end_game():
    game_id = session.get('game_id')
    player = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    result = GameController().end_game(game_id,player)
    if(result):
        print("Partita terminata")
    else:
        print("Errore")
    session.pop('game_id', None)
    session.pop('faction', None)
    return {'status': 'end'}

@app.route('/get_network_info/')
def get_network_info():
    game_id = session.get('game_id')
    player = User(session['user']['username'], session['user']['email'], session['user']['name'],
                session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, player)
    network = [node.to_dict() for node in player.getNetwork().get_nodes()]
    return {'network': network}

@app.route('/repair_vulnerabilities/', methods=['POST'])
def repair_vulnerabilities():
    vulnerabilities = request.get_json()
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                  session['user']['surname'])
    player = GameController().getPlayerFromGame(session.get('game_id'), user)
    if(player.getByteCoin()<40):
        return {'status': 'error'}
    else:
        result = GameController().repair_vulnerabilities(game_id,player, vulnerabilities)
        if(result):
            return {'status': 'success'}
        else:
            return {'status': 'error'}

@app.route('/leave_game/')
def leave_game():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                  session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    GameController().leave_game(game_id, player)
    session.pop('game_id', None)
    session.pop('faction', None)

    return {'response': 'ok'}

@app.route('/victory/')
def victory():
    game_id = session.get('game_id')
    user = User(session['user']['username'], session['user']['email'], session['user']['name'],
                  session['user']['surname'])
    player = GameController().getPlayerFromGame(game_id, user)
    return render_template('vistaUtente/victory.html', player=player)
if __name__ == '__main__':
    app.run(debug=True)


