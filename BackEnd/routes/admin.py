from flask import jsonify, request
from app import app
from model import Offer, db, Trip, Order
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

@app.route('/admin/display-all-discount', methods = ['POST'])
def display_discount():
    discounts = Offer.query.all()
    result = []
    #if having available discount
    if discounts:
        for discount in discounts:
            data = {'id':discount.id, 'code':discount.code, 'discount':discount.discount, 'available':discount.available, 'created_on':discount.created_on}
            result.append(data)
        
        return jsonify({
            'status':'OK',
            'msg':result
        })

    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Discount Available'
        })

@app.route('/admin/delete-discount/<discount_id>', methods = ['DELETE'])
def delete_discount(discount_id):
    #get discount from id
    discount = Offer.query.get(discount_id)
    if discount:
        try:
            db.session.delete(discount)
            db.session.commit()
            return jsonify({
                'status':'OK',
                'msg':'Discount Deleted'
            })
        except:
            db.session.rollback()
            return jsonify({
                'status':'FAIL',
                'err':'Could Not Delete Discount Code'
            })
    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Discount Found'
        })
    
@app.route('/admin/delete/order/<order_id>', methods = ['DELETE'])
def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        try:
            db.session.delete(order)
            db.session.commit()
            return jsonify({
                'status':'OK',
                'msg':'Order Deleted'
            })
        except:
            db.session.rollback()
            return jsonify({
                'status':'FAIL',
                'err':'Could Not Delete Order'
            })
    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Order Found'
        })
    
@app.route('/manager/delete/trip/<trip_id>', methods = ['DELETE'])
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