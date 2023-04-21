from flask import jsonify, request
from app import app
from .admin_services import check_login
from model import db, Offer, Trip, User, Session
from .booking import is_valid_email
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

#-----------MANAGER HAS 6 MORE FUNCTIONS COMPARED TO ADMIN: DELETE TRIP, ADD & DELETE DISCOUNT,VIEW ALL ADMINS. ADĐ NEW ADMIN, DELETE ADMIN ----------#

#add discount
@app.route('/manager/add-discount', methods = ['GET', 'POST'])
def add_discount():
    #check login as manager
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    else:
        if request.session.user.role_id != 1:
            return jsonify({
                'status':'FAIL',
                'err':'Unauthorized'
            })
        
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
    
#delete trip (manager)
@app.route('/manager/delete/trip/<trip_id>', methods = ['DELETE'])
def delete_trip(trip_id):
    #check login as manager
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    else:
        if request.session.user.role_id != 1:
            return jsonify({
                'status':'FAIL',
                'err':'Unauthorized'
            })
        
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
    
@app.route('/manager/display-all-admin', methods = ['POST'])
def display_all_admin():
    #check login as manager
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    else:
        if request.session.user.role_id != 1:
            return jsonify({
                'status':'FAIL',
                'err':'Unauthorized'
            })
        
    #get all User as Admin role
    admins = User.query.filter(User.role_id == 2).all()

    if not admins:
        return jsonify({
            'status':'FAIL',
            'err':'No Admin Available'
        })
    
    result = []
    for admin in admins:
        data = {'name':admin.name, 'phone':admin.phone, 'email':admin.email, 'address':admin.address, 'gender':admin.gender}
        result.append(data)
    
    return jsonify({
        'status':'OK',
        'msg':result
    })

#add new Admin by manager
@app.route('/manager/add-admin', methods = ['POST'])
def add_admin():
    #check login as manager
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    else:
        if request.session.user.role_id != 1:
            return jsonify({
                'status':'FAIL',
                'err':'Unauthorized'
            })
        
    data = request.json

    if (not data or not 'user_name' in data or not 'password' in data
         or not 'name' in data or not 'email' in data or not 'phone' in data):
        return jsonify({
            'status':'FAIL',
            'err':'Missing Required Parameters'
        })
    
    user_name = data['user_name'].strip()
    password = generate_password_hash(data['password'].strip())
    email = data['email'].strip()
    name = data['name'].strip()
    phone = data['phone']

    if not is_valid_email(email):
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid Email'
        })

    try:
        user = User(user_name = user_name, password = password, email = email, name = name, phone = phone, role_id = 2)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'status':'OK',
            'msg':'New Admin Created'
        })
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'status':'FAIL',
            'err':'User Has Already Existed'
        })
    
@app.route('/manager/delete-admin/<admin_id>', methods = ['DELETE'])
def delete_admin(admin_id):
    #check login as manager
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    else:
        if request.session.user.role_id != 1:
            return jsonify({
                'status':'FAIL',
                'err':'Unauthorized'
            })
        
    #get admin
    admin = User.query.get(admin_id)

    if not admin:
        return jsonify({
            'status':'FAIL',
            'err':'Admin Not Found'
        })
    
    db.session.delete(admin)
    db.session.commit()

    #delete session of deleted admin
    admin_sessions = Session.query.filter(Session.user_id == admin_id).all()
    
    if admin_sessions:
        for admin_session in admin_sessions:
            db.session.delete(admin_session)
            db.session.commit()

    return jsonify({
        'status':'OK',
        'msg':'Admin Deleted'
    })

#delete discount
@app.route('/manager/delete-discount/<discount_id>', methods = ['DELETE'])
def delete_discount(discount_id):
    #check login as manager
    if not check_login():
        return jsonify({
            'status':'FAIL',
            'err':'Unauthorized'
        })
    else:
        if request.session.user.role_id != 1:
            return jsonify({
                'status':'FAIL',
                'err':'Unauthorized'
            })
    
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