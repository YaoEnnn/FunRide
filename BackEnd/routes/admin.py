from flask import jsonify, request
from app import app
from model import Offer, db, Trip, Order, CarType, PrivateOrder
from datetime import datetime
from sqlalchemy.exc import IntegrityError

#add discount
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

#show all discount
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

#delete discount
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

#add new trip
@app.route('/admin/add-trip', methods = ['GET', 'POST'])
def add_trip():
    #get data from user
    data = request.json
    if (data and 'start' in data and 'end' in data and 'departure_time' in data and
         'arrived_time' in data and 'price' in data and 'departure_day' in data and 'car_type' in data):
        start = data['start']
        end = data['end']
        departure_time = datetime.strptime(data['departure_time'], '%H:%M').time()
        arrived_time = data['arrived_time']
        price = data['price']
        departure_day = data['departure_day']
        car_type = data['car_type']
    else:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    #get car from car_type
    car = CarType.query.filter_by(name = car_type).first()
    
    #check if Trip existed?
    trip = Trip.query.filter_by(
    start=start,
    end=end,
    departure_time=departure_time,
    price=price,
    departure_day=departure_day,
    car_id=car.id
    ).first()

    if trip:
        return jsonify({
            'status':'FAIL',
            'err':'Trip Has Already Existed'
        })
    
    new_trip = Trip(start=start, end=end, departure_day=departure_day, departure_time=departure_time,
                     arrived_time=arrived_time, price=price, car_id=car.id)
    
    db.session.add(new_trip)
    db.session.commit()
    return jsonify({
        'status':'OK',
        'msg': 'Trip Added Successfully'
    })

#update trip
@app.route('/admin/update-trip/<trip_id>', methods = ['PUT'])
def update_trip(trip_id):
    #get trip from db
    trip = Trip.query.get(trip_id)
    
    if not trip:
        return jsonify({
            'status': 'FAIL',
            'err': 'Trip not found'
        })

    # get data from user
    data = request.json
    if 'start' in data:
        start = data['start']
        trip.start = start
    if 'end' in data:
        end = data['end']
        trip.end = end
    if 'departure_time' in data:
        departure_time = datetime.strptime(data['departure_time'], '%H:%M').time()
        trip.departure_time = departure_time
    if 'arrived_time' in data:
        arrived_time = data['arrived_time']
        trip.arrived_time = arrived_time
    if 'price' in data:
        price = data['price']
        trip.price = price
    if 'departure_day' in data:
        departure_day = data['departure_day']
        trip.departure_day = departure_day
    if 'car_type' in data:
        car_type = data['car_type']
        car = CarType.query.filter_by(name=car_type).first()
        trip.car_id = car.id
    db.session.commit()

    return jsonify({
        'status': 'OK', 
        'msg': 'Trip updated successfully'
        })

#delete trip (manager)
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

#show all orders
@app.route('/admin/display-all/order', methods = ['POST'])
def display_all_order():
    orders = Order.query.all()
    if not orders:
        return jsonify({
            'status':'FAIL',
            'err':'No Order Available'
        })
    
    result = []
    for order in orders:
        #check offer code
        if order.offer_code == None:
            offer_code = 'N/A'
        else:
            offer_code = order.offer_code

        data = {'id':order.id, 'name':order.guest, 'phone':order.phone, 'email':order.email, 'address':order.address,
                'gender':order.gender, 'receipt':order.receipt, 'start':order.trip.start, 'end':order.trip.end,
                'departure_time':order.trip.departure_time.strftime('%H:%M'), 'arrived_time':order.trip.arrived_time,
                'departure_day':order.trip.departure_day, 'price':order.price, 'car_type':order.trip.car_type.name,
                'created_on':order.created_on, 'offer_code':offer_code}
        result.append(data)
    
    return jsonify({
        'status':'OK',
        'msg': result
    })

#get one order
@app.route('/admin/get/order/<order_id>', methods = ['POST'])
def display_one_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({
            'status':'FAIL',
            'err':'No Order Found'
        })
    
    #check offer code
    if order.offer_code == None:
        offer_code = 'N/A'
    else:
        offer_code = order.offer_code

    data = {'id':order.id, 'name':order.guest, 'phone':order.phone, 'email':order.email, 'address':order.address,
            'gender':order.gender, 'receipt':order.receipt, 'start':order.trip.start, 'end':order.trip.end,
            'departure_time':order.trip.departure_time.strftime('%H:%M'), 'arrived_time':order.trip.arrived_time,
            'departure_day':order.trip.departure_day, 'price':order.price, 'car_type':order.trip.car_type.name,
            'created_on':order.created_on, 'offer_code':offer_code}
    return jsonify({
        'status':'OK',
        'msg': data
    })
    

#delete order
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

#show all private orders
@app.route('/admin/display-all/private-order', methods = ['POST'])
def display_all_private_order():
    private_orders = PrivateOrder.query.all()
    if not private_orders:
        return jsonify({
            'status':'FAIL',
            'err':'No Private Order Found'
        })
    
    result = []
    for order in private_orders:
        car = CarType.query.get(order.car_id)

        if order.round_trip == True:
            data = {'id':order.id, 'name':order.guest, 'phone':order.phone, 'email':order.email, 'gender':order.gender,
                 'note':order.note, 'number_guest':order.number_guest, 'departure_day':order.departure_day, 'departure_time':order.departure_time,
                 'start':order.start, 'end':order.end, 'round_trip':order.round_trip, 'back_day':order.back_day, 'back_time':order.back_time,
                 'car_type':car.name}
        else:
            data = {'id':order.id, 'name':order.guest, 'phone':order.phone, 'email':order.email, 'gender':order.gender,
                 'note':order.note, 'number_guest':order.number_guest, 'departure_day':order.departure_day, 'departure_time':order.departure_time,
                 'start':order.start, 'end':order.end, 'car_type':car.name}
        
        result.append(data)

    return jsonify({
        'status':'OK',
        'msg':result
    })
    
#get 1 private order
@app.route('/admin/get/private-order/<order_id>', methods = ['POST'])
def display_one_private_order(order_id):
    private_order = PrivateOrder.query.get(order_id)
    if not private_order:
        return jsonify({
            'status':'FAIL',
            'err':'No Private Order Found'
        })

    car = CarType.query.get(private_order.car_id)

    if private_order.round_trip == True:
        data = {'id':private_order.id, 'name':private_order.guest, 'phone':private_order.phone, 'email':private_order.email, 'gender':private_order.gender,
                'note':private_order.note, 'number_guest':private_order.number_guest, 'departure_day':private_order.departure_day, 'departure_time':private_order.departure_time,
                'start':private_order.start, 'end':private_order.end, 'round_trip':private_order.round_trip, 'back_day':private_order.back_day, 'back_time':private_order.back_time,
                'car_type':car.name}
    else:
        data = {'id':private_order.id, 'name':private_order.guest, 'phone':private_order.phone, 'email':private_order.email, 'gender':private_order.gender,
                'note':private_order.note, 'number_guest':private_order.number_guest, 'departure_day':private_order.departure_day, 'departure_time':private_order.departure_time,
                'start':private_order.start, 'end':private_order.end, 'car_type':car.name}

    return jsonify({
        'status':'OK',
        'msg':data
    })

#delete private order
@app.route('/admin/delete/private-order/<order_id>', methods = ['DELETE'])
def delete_private_order(order_id):
    private_order = PrivateOrder.query.get(order_id)
    if not private_order:
        return jsonify({
            'status':'OK',
            'err':'No Private Order Found'
        })
    
    try:
        db.session.delete(private_order)
        db.session.commit()
        return jsonify({
            'status':'OK',
            'msg':'Private Order Deleted'
        })
    except:
        db.session.rollback()
        return jsonify({
            'status':'FAIL',
            'err':'Could Not Delete Private Order'
        })

#Search Order
@app.route('/admin/search-order', methods = ['POST'])
def search_order():
    data = request.json
    if data and 'user_data' in data:
        user_data = data['user_data'].strip()
    else:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    orders = Order.query.filter((Order.guest.ilike(f'%{user_data}%')) | (Order.phone.ilike(f'%{user_data}%'))).all()

    if orders:
        result = []

        for order in orders:
            #check offer code
            if order.offer_code == None:
                offer_code = 'N/A'
            else:
                offer_code = order.offer_code

            data = {'id':order.id, 'name':order.guest, 'phone':order.phone, 'email':order.email, 'address':order.address,
                    'gender':order.gender, 'receipt':order.receipt, 'start':order.trip.start, 'end':order.trip.end,
                    'departure_time':order.trip.departure_time.strftime('%H:%M'), 'arrived_time':order.trip.arrived_time,
                    'departure_day':order.trip.departure_day, 'price':order.price, 'car_type':order.trip.car_type.name,
                    'created_on':order.created_on, 'offer_code':offer_code}
            
            result.append(data)

            return jsonify({
                'status':'OK',
                'msg': result
            })
    
    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Order Found'
        })
