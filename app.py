
from flask import Flask,render_template, request, redirect, url_for, flash, session
from classes.model.PlayerClassesModel import Player
from classes.model.PlayerClassesModel import User
from classes.controller.DatabaseController import DatabaseController
from classes.model.NetworkNodeModel import NetworkNode
from classes.model.NetworkModel import NetworkModel
from classes.MitreAttackAPI import MitreAttackClass
app = Flask(__name__)
app.secret_key='reich_hackers'
dbController = DatabaseController()
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
    Player1 = Player("Piero", "Allies")
    Player2 = Player("Player2", "Allies")
    print(Player1.toString() + " vs " + Player2.toString())
    return render_template('vistaAlleati/index.html', player=Player1)
@app.route('/homepage_game_axis')
def homepage_game_axis():
    return render_template('vistaAsse/index.html')

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

    returnValue = dbController.registerUser(username, email, password, name, surname)
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
    returnValue = dbController.loginUser(email, password)
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

@app.route('/create_game', methods=['POST','GET'])
def create_game():
    selectedFaction = request.args.get('side')
    if selectedFaction == "allies":
        print("Alleati")
    else:
        if selectedFaction == "axis":
            print("Asse")
        else:
            print("Errore")

    player = Player(session['user']['username'], selectedFaction)
    dbController.matchmacking(player)


@app.route('/provaNodo')
def provaNodo():
    network = NetworkModel()
    nodes = network.get_nodes()
    return render_template('mitreattack.html',data=nodes)



#Da vedere come implemnteare la chiamata all'API
@app.route('/mitreattack-api')
def mitreattack_api():
    api = MitreAttackClass()
    technique = api.get_tecnique_by_id("T1003")
    return render_template('mitreattack.html',data=technique)

if __name__ == '__main__':
    app.run(debug=True)


