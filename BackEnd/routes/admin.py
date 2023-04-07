from flask import jsonify, request
from app import app
from model import Offer, db, Trip
from sqlalchemy.exc import IntegrityError

@app.route('/admin/add-discount', methods = ['GET', 'POST'])
def add_discount():
    #get data from admin
    data = request.json
    if data and 'code' in data and 'discount' in data and 'available' in data:
        code = data['code'].strip()
        discount = data['discount']
        available = data['available']
    else:
        return jsonify({
            'status':'FAIL',
            'msg':'Missing Parameters'
        })
    
    #try add discount code into DB
    try:
        offer = Offer(code = code, discount = discount, available = available)
        db.session.add(offer)
        db.session.commit()

        return jsonify({
            'status':'OK',
            'msg':'Add Discount Successfully'
        })

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'status':'FAIL',
            'err':'Code Has Already Existed'
        })
    
@app.route('/admin/delete/<trip_id>', methods = ['DELETE'])
def delete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if trip:
        try:
            db.session.delete(trip)
            db.session.commit()
            return jsonify({
                'status':'OK',
                'msg':'Trip Deleted'
            })
        except:
            db.session.rollback()
            return jsonify({
                'status':'FAIL',
                'err':'Could Not Delete Trip'
            })
    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Trip Found'
        })