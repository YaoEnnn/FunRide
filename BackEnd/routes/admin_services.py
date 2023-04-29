from flask import jsonify, request, render_template
from app import app, mail
from model import Offer, db, Trip, Order, CarType, PrivateOrder, User, Session, Role
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from datetime import datetime
from flask_mail import Message
from .booking import is_valid_email

#show all discount
@app.route('/admin/display-all-discount', methods = ['POST'])
def display_discount():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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

#add new trip
@app.route('/admin/add-trip', methods = ['GET', 'POST'])
def add_trip():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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

#show all orders
@app.route('/admin/display-all/order', methods = ['POST'])
def display_all_order():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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
@app.route('/admin/delete/order/<order_id>', methods = ['POST'])
def delete_order(order_id):
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    order = Order.query.get(order_id)
    #get data send email from admin or manager
    data = request.json

    if order:
        # try:

        if data and "send_mail" in data:
            send_mail = data['send_mail']
            seats = order.seat_ref
            seat_booked = []
            for seat in seats:
                seat_booked.append(seat.seat_number)
                
        #send email to user if need
        if send_mail == True:
            msg = Message("Your Order Has Been Cancelled",
            sender=app.config.get("MAIL_USERNAME"),
            recipients=[order.email])
            msg.html = render_template("cancel_order.html",
            start = order.trip.start,
            end = order.trip.end,
            seat = seat_booked)
            mail.send(msg)
        
        db.session.delete(order)
        db.session.commit()

        return jsonify({
            'status':'OK',
            'msg':'Order Deleted'
        })
        # except:
        #     db.session.rollback()
        #     return jsonify({
        #         'status':'FAIL',
        #         'err':'Could Not Delete Order'
        #     })
    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Order Found'
        })

#show all private orders
@app.route('/admin/display-all/private-order', methods = ['POST'])
def display_all_private_order():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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
                 'note':order.note, 'number_guest':order.number_guest,'round_trip':order.round_trip, 'departure_day':order.departure_day, 'departure_time':order.departure_time,
                 'start':order.start, 'end':order.end, 'car_type':car.name}
        
        result.append(data)

    return jsonify({
        'status':'OK',
        'msg':result
    })
    
#get 1 private order
@app.route('/admin/get/private-order/<order_id>', methods = ['POST'])
def display_one_private_order(order_id):
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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
@app.route('/admin/delete/private-order/<order_id>', methods = ['POST'])
def delete_private_order(order_id):
    #check login
    print ('hello world')
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    private_order = PrivateOrder.query.get(order_id)
    if not private_order:
        return jsonify({
            'status':'OK',
            'err':'No Private Order Found'
        })
    
    data = request.json
    
    try:

        if data and "send_mail" in data:
            send_mail = data['send_mail']
        # send email to user if need
        if send_mail == True:
            msg = Message("Your Private Order Has Been Cancelled",
            sender=app.config.get("MAIL_USERNAME"),
            recipients=[private_order.email])
            msg.html = render_template("cancel_private_order.html",
            start = private_order.start,
            end = private_order.end)
            mail.send(msg)
        
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
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
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
    
@app.route('/admin/search-private-order', methods = ['POST'])
def search_private_order():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    data = request.json
    if data and 'user_data' in data:
        user_data = data['user_data'].strip()
    else:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    orders = PrivateOrder.query.filter((PrivateOrder.guest.ilike(f'%{user_data}%')) | (PrivateOrder.phone.ilike(f'%{user_data}%'))).all()

    if orders:
        result = []

        for order in orders:
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
    
    else:
        return jsonify({
            'status':'FAIL',
            'err':'No Private Order Found'
        })

#Login Route for Admin and Manager
@app.route('/admin/login', methods = ['POST'])
def login_func():
    data = request.json
    if not data or not 'user_name' in data or not 'password' in data:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    user_name = data['user_name'].strip()
    password = data['password'].strip()

    #check user name
    user = User.query.filter(User.user_name == user_name).first()

    if not user:
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid User-Name'
        })
    
    #checf password
    if not check_password_hash(user.password, password):
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid Password'
        })
    #check password hash = True
    else:
        session = Session(user.id)
        db.session.add(session)
        db.session.commit()

        #return token for logging in
        return jsonify({
            'status':'OK',
            'msg':session.token
        })
    
@app.route('/admin/logout', methods = ['POST'])
def logout():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    #get current user
    user = request.session.user

    user_session = Session.query.filter_by(user_id = user.id).first()

    if user_session is not None:
        # delete user session
        db.session.delete(user_session)
        db.session.commit()
        return jsonify({
            'status': 'OK',
            'msg': 'Logout Successfully'
        })
    else:
        return jsonify({
            'status': 'FAIL',
            'err': 'Fail to Logout'
        })

@app.route('/admin/logout-all-devices', methods = ['POST'])
def logout_all():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    #get current user
    user = request.session.user

    user_sessions = Session.query.filter_by(user_id = user.id).all()

    if user_sessions is not None:
        for user_session in user_sessions:
            # delete user session
            db.session.delete(user_session)
            db.session.commit()
        return jsonify({
            'status': 'OK',
            'msg': 'Logout Successfully'
        })
    else:
        return jsonify({
            'status': 'FAIL',
            'err': 'Fail to Logout'
        })
    
#Update info for data or manager
@app.route('/admin/update-info/', methods = ['POST'])
def update_user_info():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    data = request.json
    user = User.query.get(request.session.user.id)
    if not data:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Paramerters'
        })
    
    if 'name' in data:
        name = data['name'].strip()
        user.name = name
    if 'phone' in data:
        phone = data['phone']
        user.phone = phone
    if 'email' in data:
        email = data['email'].strip()
        #Validating email
        if not is_valid_email(email):
            return jsonify({
                'status':'FAIL',
                'err':'Invalid Email'
            })
        else:
            user.email = email
    if 'address' in data:
        address = data['address'].strip()
        user.address = address
    if 'gender' in data:
        gender = data['gender'].strip()
        user.gender = gender
    
    db.session.commit()

    return jsonify({
        'status':'OK',
        'msg':'Information Updated'
    })

#view personal profile
@app.route('/admin/my-profile', methods = ['POST'])
def my_profile():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    #get current user
    user = request.session.user

    #get user role
    role = Role.query.get(user.role_id)

    profile = {'user_name':user.user_name, 'name':user.name, 'phone':user.phone,
                'email':user.email, 'address':user.address, 'gender':user.gender, 'role':role.name}
    
    return jsonify({
        'status':'OK',
        'msg':profile
    })

#change password
@app.route('/admin/change-password', methods = ['POST'])
def change_password():
    #check login
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    
    data = request.json
    if not data or not 'old_password' in data or not 'new_password' in data or not 'verify_password' in data:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    old_password = data['old_password']
    new_password = data['new_password']
    verify_password = data['verify_password']

    #get current user info
    user = request.session.user

    if not check_password_hash(user.password, old_password):
        return jsonify({
            'status':'FAIL',
            'err':'Wrong Old Password'
        })
    
    if check_password_hash(user.password, new_password):
        return jsonify({
            'status':'FAIL',
            'err':'New Password is The Same To Old Password'
        })
    
    if new_password != verify_password:
        return jsonify({
            'status':'FAIL',
            'err':'Double Check Password Failed'
        })
    
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({
        'status':'OK',
        'msg':'Password Changed'
    })

def     check_login():
    #get token from FrontEnd
    token = request.headers.get("Authorization")

    if not token:
        return False

    #get session from token
    session = Session.query.filter_by(token=token).first()
    
    if not session:
        return False

    # Session exists, time to get user here
    request.session = session
    
    # CHecking for expiry
    if datetime.now() > session.expiry_day:
        
        db.session.delete(session)
        db.session.commit()
        
        return False
   
    return True;