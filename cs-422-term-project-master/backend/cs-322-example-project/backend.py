from __future__ import print_function
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy
from sqlalchemy import func

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///profDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = sqlalchemy.SQLAlchemy(app)


class Professor(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    # FINISH ME (TASK 2): add all of the columns for the other table attributes
    name = db.Column(db.String(30))
    lastname = db.Column(db.String(30))
    affiliate = db.Column(db.String(100))
    school = db.Column(db.Integer)
    overall_rating = db.Column(db.Float, default=-1)


class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    prof_id = db.Column(db.String(10))
    # FINISH ME (TASK 2): add all of the columns for the other table attributes
    review_text = db.Column(db.String(500))
    rating = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)


base_url = '/api/'


# loads all professors
# route parameters:
#     (optional) count : if count parameter is specified, limits the number of professorrs by count
#     (optional) order_by : if order_by is specified, orders the results by order_by
# Response format is JSON
@app.route(base_url + 'allprofs', methods=['GET'])
def getAllProfs():
    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)
    query = None  # store the results of your query here
    # FINISH ME (Task 3) : set the column which you are ordering on (if order_by parameter provided)
    order = None
    if order_by == "lastname":
        order = Professor.lastname
    elif order_by == "name":
        order = Professor.name
    elif order_by == "overall_rating":
        order = Professor.overall_rating.desc()
    elif order_by == "school":
        order = Professor.school

    if order is not None:
        query = Professor.query.order_by(order)
    else:
        query = Professor.query
    # FINISH ME (Task 3) : limit the number of professors based on the count (if count parameter is provided)
    if count is not None:
        query = query.limit(count).all()

    result = []
    for row in query:
        result.append(
            row_to_obj_prof(row)
        )

    return jsonify({"status": 1, "professors": result})


# createProf
# creates a professor 
# The routes response includes the information of the new professor in the response
# Response format is JSON
# FINISH ME (Task 4) : Create the route for POST newprofessor
@app.route(base_url + "newprofessor", methods=["POST"])
def createProf():
    professor = Professor(**request.json)
    db.session.add(professor)
    db.session.commit()
    db.session.refresh(professor)
    return jsonify({"status": 1, "professor": row_to_obj_prof(professor)}), 200


# addReview
# creates a review for the professor with the given id
# calculates and updates the new average rating for the professor after the new review is posted
# The route response includes both the review info and the updated professor info. 
# Response format is JSON
# FINISH ME (Task 5) : Create the route for POST addreview
@app.route(base_url + "addreview", methods=["POST"])
def addReview():
    # this route does not have any arguments; id, rating and review_text are sent as JSON in the request. first
    # create the new "review" (similar to 83-86). Then review.prof_id will be the id of the professor we will update.
    review = Reviews(**request.json)
    prof_id = review.prof_id
    rating = review.rating

    # You need to calculate the average rating from the Review table and then get the professor that has the id =
    # prof_id (see below comment) and update his overall_rating. (This is similar to the "like" route in Smile.) You
    # don't need to create a new professor here. You need to query the Professor table for id = prof_id . For
    # example: Professor.query.filter_by(id=prof_id)...
    professor = Professor.query.filter_by(id=review.prof_id).first()
    prof_reviews = Reviews.query.filter_by(id=review.prof_id).all()

    review_sum = 0
    for rev in prof_reviews:
        review_sum += rev.rating

    review_sum += rating
    new_rating = review_sum / (len(prof_reviews) + 1)

    professor.rating = new_rating

    db.session.add(professor)
    db.session.commit()
    db.session.refresh(professor)

    db.session.add(review)
    db.session.commit()
    db.session.refresh(review)
    # You should't send all professor data, but only the prof_id and new rating.
    return jsonify({"professor": {"id": prof_id, "overall_rating": new_rating},
                    "review": row_to_obj_review(review), "status": 1}), 200


# getreviews
# gets all reviews for the given professor
# route parameters:
#     profID :  filters the reviews based on the profID. If profID is not specified, the response will be empty. 
#     (optional) count : if count parameter is specified, limits the number of professors by count
#     (optional) order_by : if order_by is specified, orders the results by order_by
# Response format is JSON

# FINISH ME (Task 6) : Create the route for GET getreviews
@app.route(base_url + 'getreviews', methods=["GET"])
def getReviews():
    prof_id = request.args.get('profID', None)
    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)
    query = None

    order = None
    if order_by == "rating":
        order = Reviews.rating.desc()
    elif order_by == "review_text":
        order = Reviews.review_text
    elif order_by == "created_at":
        order = Reviews.created_at.desc()

    if order is not None:
        query = Reviews.query.order_by(order)
    else:
        query = Reviews.query

    if count is not None:
        query = query.limit(count).all()

    result = []
    for row in query:
        result.append(
            row_to_obj_review(row)
        )

    return jsonify({"status": 1, "reviews": result})


# delete_professors
# delete given an id
@app.route(base_url + 'remove', methods=['DELETE'])
def delete_professors():
    myid = request.args.get('id', None)
    # FINISH ME (Task 7) : Complete the route for DELETE professor;
    # should first delete the reviews provided for the professor then the professor him/herself
    if myid is None or myid is '':
        return {'status': -1, 'error': 'Must provide id'}, 500

    Reviews.query.filter_by(id=myid).delete()
    Professor.query.filter_by(id=myid).delete()
    db.session.commit()
    return jsonify({'status': 1}), 200


def row_to_obj_prof(row):
    myrow = {
        "id": row.id,
        "name": row.name,
        "lastname": row.lastname,
        "affiliate": row.affiliate,
        "school": row.school,
        "overall_rating": row.overall_rating
    }
    return myrow


def row_to_obj_review(row):
    myrow = {
        "id": row.id,
        "prof_id": row.prof_id,
        "review_text": row.review_text,
        "rating": row.rating,
        "created_at": row.created_at
    }
    return myrow


def main():
    db.create_all()  # creates the tables you've provided
    app.run()  # runs the Flask application


if __name__ == '__main__':
    app.debug = True
    main()
