from flask import jsonify, request, render_template
from app import app, mail
from model import db, Offer, Trip, User, RecoveryPassword
from datetime import datetime
from flask_mail import Message
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

@app.route('/admin/forgot-password', methods = ['POST'])
def forgot_password():
    data = request.json
    if not data or not 'email' in data:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameter'
        })
    
    email = data['email']

    #check is email existed in DB
    user = User.query.filter(User.email == email).first()

    if not user:
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid Email'
        })
    
    #create new Object for RecoveryPassword
    recovery_password = RecoveryPassword(user.id)
    db.session.add(recovery_password)
    db.session.commit()

    #send mail to user with code
    msg = Message("Recover Password from FunRide!",
    sender=app.config.get("MAIL_USERNAME"),
    recipients=[email])
    msg.html = render_template("forgot_password.html",
    code = recovery_password.code)
    mail.send(msg)

    return jsonify({
        'status':'OK',
        'msg':'Mail Sent'
    })

@app.route('/admin/verify-code', methods = ['POST'])
def verify_code():
    data = request.json
    if not data or not 'code' in data:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameter'
        })
    
    code = data['code']

    recover_password = RecoveryPassword.query.filter_by(code = code).first()

    #check if code valid?
    if not recover_password:
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid Code'
        })
    
    #check if code expired? if expired, delete it from db
    if recover_password.expiry_time < datetime.now():
        db.session.delete(recover_password)
        db.session.commit()
        return jsonify({
            'status':'FAIL',
            'err':'Code Has Expired, Please Do Again'
        })
    
    #get user
    user = recover_password.user
    
    return jsonify({
        'status':'OK',
        'msg':user.id
    })

@app.route('/admin/update-forgot-password/<user_id>', methods = ['POST'])
def update_password(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({
            'status':'FAIL',
            'err':'No User Found'
        })
    
    data = request.json
    if not data or not 'new_password' in data or not 'verify_password' in data:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    new_password = data['new_password']
    verify_password = data['verify_password']

    if new_password != verify_password:
        return jsonify({
            'status':'FAIL',
            'err':'Unmatch Verified Password'
        })
    
    recovery_password = user.recovery_ref[0]

    #change password and delete recovery_password belong to this user
    user.password = generate_password_hash(new_password)
    db.session.delete(recovery_password)
    db.session.commit()


    return jsonify({
        'status':'OK',
        'msg':'Password Changed'
    })

