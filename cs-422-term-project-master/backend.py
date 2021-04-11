from __future__ import print_function
import sys
from flask import Flask, jsonify, make_response, request, redirect
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy
from sqlalchemy import func, or_

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://localhost/422'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = sqlalchemy.SQLAlchemy(app)
base_url = '/api/'


### Classes

class User(db.Model):
    __tablename__ = 'user'
    username = db.Column(db.String(30), primary_key=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)
    firstname = db.Column(db.String(30))
    lastname = db.Column(db.String(30))
    isOwner = db.Column(db.Boolean, default=False)
    phone = db.Column(db.String(17))

    def __init__(self, isOwner, username='', password='', firstname='', lastname='', phone=''):
        self.username = username
        self.password = password
        self.firstname = firstname
        self.lastname = lastname
        self.isOwner = isOwner
        self.phone = phone


class Apply(db.Model):
    __tablename__ = 'apply'
    firstname = db.Column(db.String(30))
    lastname = db.Column(db.String(30))
    primary_phone = db.Column(db.String(17))
    email = db.Column(db.String(30), primary_key=True, nullable=False)
    password = db.Column(db.String(30))
    confirm_password = db.Column(db.String(30))

    def __init__(self, firstname='', lastname='', primary_phone='', email='', password='', confirm_password=''):
        self.firstname = firstname
        self.lastname = lastname
        self.primary_phone = primary_phone
        self.email = email
        self.password = password
        self.confirm_password = confirm_password


class Property(db.Model):
    __tablename__ = 'property'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50))
    address = db.Column(db.String(100))
    description = db.Column(db.String(250))
    price = db.Column(db.String(30))
    rating = db.Column(db.Float, default=0)

    def __init__(self, name='', address='', description='', price=0, rating=0):
        self.name = name
        self.address = address
        self.description = description
        self.price = price
        self.rating = rating


class Thread(db.Model):
    __tablename__ = 'thread'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user1 = db.Column(db.String(30), db.ForeignKey('user.username'), nullable=False)
    user2 = db.Column(db.String(30), db.ForeignKey('user.username'), nullable=False)
    subject = db.Column(db.String(300))


class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    threadId = db.Column(db.Integer, db.ForeignKey('thread.id'))
    content = db.Column(db.String(300))
    sender = db.Column(db.String(30), db.ForeignKey('user.username'), nullable=False)
    receiver = db.Column(db.String(30), db.ForeignKey('user.username'), nullable=False)


### Routes

# Returns properties that match the optional parameters
# Route parameters:
#     (optional) count : if count parameter is specified, limits the number of properties by count
#     (optional) order_by : if order_by is specified, orders the results by order_by
#     (optional) search : if search is specified, retrieve apartments that match the given regex
# Response format is JSON
@app.route(base_url + 'properties', methods=['GET'])
def getAllProperties():
    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)
    search = request.args.get('q', None)

    query = None  # store the results of your query here
    order = None

    if order_by is not None:
        if order_by == "rating":
            order = Property.rating.desc()
        elif order_by == "name":
            order = Property.name
        elif order_by == "price":
            order = Property.price

    if order is not None:
        query = Property.query.order_by(order)
    else:
        query = Property.query

    if count is not None:
        query = query.limit(count).all()

    if search is not None:
        query = Property.query.filter(Property.column.like(search))

    result = []
    for row in query:
        result.append(
            row_to_obj_property(row)
        )
    return jsonify({"status": 1, "properties": result})


# Returns all messages of a given threadId
# Route parameters:
#     (required) threadId : the threadId used to retrieve messages
# Response format is JSON
@app.route('/messages/thread', methods=['GET'])
def getThread():
    threadId = request.args.get('threadId', None)
    query = Message.query.filter_by(threadId=threadId)
    result = []
    for row in query:
        result.append(
            row_to_obj_message(row)
        )
    return jsonify({"status": 1, "messages": result})

@app.route('/messages/' + "thread", methods=["POST"])
def createThread():
    thread = Thread(**request.json)
    db.session.add(thread)
    db.session.commit()
    db.session.refresh(thread)
    return jsonify({"status": 1, "thread": row_to_obj_thread(thread)}), 200

@app.route('/messages/' + "create", methods=["POST"])
def createMessage():
    message = Message(**request.json)
    db.session.add(message)
    db.session.commit()
    db.session.refresh(message)
    return jsonify({"status": 1, "message": row_to_obj_message(message)}), 200


# Returns the first message that matches the given messageId
# Route parameters:
#     (required) messageId : the messageId used to retrieve messages
# Response format is JSON
@app.route('/messages/message', methods=['GET'])
def getMessage():
    messageId = request.args.get('messageId', None)
    query = Message.query.filter_by(id=messageId)
    result = []
    for row in query:
        result.append(
            row_to_obj_message(row)
        )
    return jsonify({"status": 1, "message": result[0]})


# Returns all threads that the given user participates in
# Route parameters:
#     (required) username : the username used to retrieve thread ids
# Response format is JSON
@app.route('/messages/' + 'user_threads', methods=['GET'])
def getUserThreads():
    username = request.args.get('username', None)
    query = Thread.query.filter(or_(Thread.user1 == username, Thread.user2 == username))
    result = []
    for row in query:
        result.append(
            row_to_obj_thread(row)
        )
    return jsonify({"status": 1, "threads": result})


# Creates a property
# The route's response includes the information of the new property
# Route parameters:
#     (optional) name : the name of the property
#     (optional) address : the address of the property
#     (optional) description : the description of the property
#     (optional) price : the price of the property
#     (optional) rating : the average rating from 1-5 of the property
# Response format is JSON
@app.route(base_url + "new_property", methods=["POST"])
def createProperty():
    name = request.args.get('name', None)
    address = request.args.get('address', None)
    description = request.args.get('description', None)
    price = float(request.args.get('price', None))
    rating = float(request.args.get('rating', None))
    if price < 0:
        return jsonify({'error': 'Price cannot be negative.'})
    if rating > 5:
        return jsonify({'error': 'Rating must be less than or equal to 5.'})
    if rating < 1:
        return jsonify({'error': 'Rating must be greater than or equal to 1.'})
    property = Property(name, address, description, price, rating)
    db.session.add(property)
    db.session.commit()
    db.session.refresh(property)
    return jsonify({"status": 1, "property": row_to_obj_property(property)}), 200


# Verify user login
# The routes response includes the information of the existing account
# Route parameters:
#     (required) username : the user's username
#     (required) password : the user's password
# Redirects the user to create a new account if user does not exist
# Redirects the user to index if login is successful
@app.route(base_url + "login", methods=["GET", "POST"])
def login():
    # check for user, if user does not exist, redirect to the create_account route
    username = request.args.get('username', None)
    password = request.args.get('password', None)
    test_user = User.query.filter_by(username=username).first()
    if test_user is not None:
        if test_user.password == password:
            print('Logged in successfully.')
            return jsonify({'status': '1'})
        else:
            return jsonify({'error': 'Password is incorrect.'})
    else:
        print('User does not exist.')
        return jsonify({'error': 'User does not exist.'})


# Logs the current user out
# Redirects the user to the login page
@app.route(base_url + "logout")
def logout():
    return redirect(base_url + "login")


# Creates a new account
# The route's response includes the information of the new account
# Route parameters:
#     (required) username : the username of the new account
#     (optional) password : the password of the new account
#     (optional) firstname : the first name of the new user
#     (optional) lastname : the last name of the new user
#     (optional) isOwner : whether the new user is an admin
# Response format is JSON
@app.route(base_url + "create_account", methods=["POST"])
def createAccount():
    username = request.args.get('username', None)
    password = request.args.get('password', None)
    firstname = request.args.get('firstname', None)
    if len(firstname) > 20:
        return jsonify({'error': 'First name is too long.'})
    if len(firstname) < 1:
        return jsonify({'error': 'First name is too short.'})
    lastname = request.args.get('lastname', None)
    if len(lastname) > 20:
        return jsonify({'error': 'Last name is too long.'})
    if len(lastname) < 1:
        return jsonify({'error': 'Last name is too short.'})
    isOwner = request.args.get('isOwner', None)
    phone = request.args.get('phone', None)
    user = User(isOwner, username, password, firstname, lastname, phone)
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)
    return jsonify({"status": 1, "account": row_to_obj_user(user)}), 200


# Returns a user if they exist
# Route parameters:
#     (required) username: the username of the user
# Response format is JSON
@app.route(base_url + 'user', methods=['GET'])
def getUser():
    username = request.args.get('username', None)
    query = User.query.filter_by(username=username)
    result = []
    for row in query:
        result.append(
            row_to_obj_user(row)
        )
    return jsonify({"status": 1, "user": result[0]})


# Formats a property in JSON
def row_to_obj_property(row):
    my_row = {
        "id": row.id,
        "name": row.name,
        "address": row.address,
        "description": row.description,
        "price": row.price,
        "rating": row.rating
    }
    return my_row


# Formats a user in JSON
def row_to_obj_user(row):
    my_row = {
        "username": row.username,
        "password": row.password,
        "firstname": row.firstname,
        "lastname": row.lastname,
        "isOwner": row.isOwner,
        "phone": row.phone
    }
    return my_row


# Formats messages in JSON
def row_to_obj_message(row):
    my_row = {
        "id": row.id,
        "threadId": row.threadId,
        "content": row.content,
        "sender": row.sender,
        "receiver": row.receiver
    }
    return my_row


# Formats threads in JSON
def row_to_obj_thread(row):
    my_row = {
        "id": row.id,
        "sender": row.user1,
        "receiver": row.user2,
        "subject": row.subject
    }
    return my_row


def main():
    db.create_all()  # creates the tables you've provided
    app.run()  # runs the Flask application


if __name__ == '__main__':
    app.debug = True
    main()
