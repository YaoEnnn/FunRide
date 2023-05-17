from app import app, mail
from flask import request, jsonify, render_template
from model import Trip, Offer, Order, db, Seat, CarType, PrivateOrder
import re
from flask_mail import Message
from sqlalchemy.exc import IntegrityError

@app.route('/show-booked-seat/<trip_id>', methods = ['POST'])
def show_booked_seat(trip_id):
    #get all seats from trip_id
    seats = Seat.query.filter_by(trip_id = trip_id).all()
    result = []

    for seat in seats:
        result.append(seat.seat_number)
    return jsonify({
        'status':'OK',
        'msg': result
    })

@app.route('/trip/<trip_id>/order', methods = ['GET', 'POST'])
def booking_seat(trip_id):
    #get trip and check if it available?
    trip = Trip.query.get(trip_id)
    if trip:
        data = request.json
        if data and 'name' in data and 'gender' in data and 'phone' in data and 'email' in data and 'address' in data and 'seat' in data:
            guest = data['name'].strip()
            gender = data['gender'].strip()
            phone = data['phone']
            email = data['email'].strip()
            address = data['address'].strip()
            seat = data['seat']
        else:
            return jsonify({
                'status':'FAIL',
                'err':'Missing Parameter'
            })
        
        #check for valid email
        if not is_valid_email(email):
            return jsonify({
                'status':'FAIL',
                'err':'Unvalid Email'
            })
        
        else:
            #check if user enter discount code?
            if 'offer' in data and 'offer' != '':
                offer_code = data['offer']
            
                #validate offer code
                offer = Offer.query.filter_by(code = offer_code).first()
                if not offer:
                    return jsonify({
                        'status':'FAIL',
                        'err':'Unvalid Discount Code'
                    })
                
                else:
                    #calculate order's price
                    price = int((trip.price*len(seat)*(100 - offer.discount))/100)

                    #Add to DB
                    try:
                        new_order = Order(guest = guest, gender = gender, phone = phone, email = email,
                                           address = address, trip_id = trip_id, price = price, offer_code = offer_code)
                        db.session.add(new_order)
                        db.session.commit()
                    except IntegrityError:
                        db.session.rollback()
                        return jsonify({
                            'status':'FAIL',
                            'err':'Could Not Create New Order'
                        })
                    
                    #Minus 1 offer-using time
                    offer.available = offer.available - 1
                    db.session.commit()

                    if offer.available == 0:
                        db.session.delete(offer)
                        db.session.commit()
                    
                    #Get Seat Number that User Chose
                    for each_seat in seat:
                        new_seat = Seat(seat_number = each_seat, trip_id = trip_id, order_id = new_order.id)
                        db.session.add(new_seat)
                        db.session.commit()

                    #send email to customer
                    auto_send_mail("Thank You For Choosing FunRide!", email, trip.start, trip.end, trip.departure_day, 
                                   trip.departure_time.strftime("%H:%M"), trip.arrived_time, guest, gender, phone,
                                     address, price, new_order.receipt, new_order.created_on, seat, trip.car_type.name, offer_code)
                    
                    # send mail to company
                    auto_send_mail("You Have New Order!", "Funride.company.2023@gmail.com", trip.start, trip.end, trip.departure_day,
                                    trip.departure_time.strftime("%H:%M"), trip.arrived_time, guest, gender, phone,
                                      address, price, new_order.receipt, new_order.created_on, seat, trip.car_type.name, offer_code)
                    
                    return jsonify({
                        'status': 'OK',
                        'msg': {
                            'start': trip.start,
                            'end': trip.end,
                            'departure_day': trip.departure_day,
                            'departure_time': trip.departure_time.strftime("%H:%M"),
                            'arrived_time': trip.arrived_time,
                            'name': new_order.guest,
                            'gender': new_order.gender,
                            'phone': new_order.phone,
                            'email': new_order.email,
                            'address': new_order.address,
                            'price': new_order.price,
                            'receipt': new_order.receipt,
                            'created_on':new_order.created_on,
                            'seat': seat,
                            'offer_code':offer_code
                        } 
                    })
                
            #if not discount code
            else:
                #calculate order's price
                price = trip.price*len(seat)

                #Add to DB
                try:
                    new_order = Order(guest = guest, gender = gender, phone = phone, email = email,
                                       address = address, trip_id = trip_id, price = price, offer_code = None)
                    db.session.add(new_order)
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback()
                    return jsonify({
                        'status':'FAIL',
                        'err':'Could Not Create New Order'
                    })
                
                #Get Seat Number that User Chose
                for each_seat in seat:
                    new_seat = Seat(seat_number = each_seat, trip_id = trip_id, order_id = new_order.id)
                    db.session.add(new_seat)
                    db.session.commit()

                # send email to customer
                auto_send_mail("Thank You For Choosing FunRide!", email, trip.start, trip.end, trip.departure_day, trip.departure_time.strftime("%H:%M"), trip.arrived_time,
                               guest, gender, phone, address, price, new_order.receipt, new_order.created_on, seat, trip.car_type.name, "N/A")
                
                # send mail to company
                auto_send_mail("You Have New Order!", "Funride.company.2023@gmail.com", trip.start, trip.end, trip.departure_day, trip.departure_time.strftime("%H:%M"), trip.arrived_time,
                               guest, gender, phone, address, price, new_order.receipt, new_order.created_on, seat, trip.car_type.name, "N/A")
                
                return jsonify({
                    'status': 'OK',
                    'msg': {
                        'start': trip.start,
                        'end': trip.end,
                        'departure_day': trip.departure_day,
                        'departure_time': trip.departure_time.strftime("%H:%M"),
                        'arrived_time': trip.arrived_time,
                        'name': new_order.guest,
                        'gender': new_order.gender,
                        'phone': new_order.phone,
                        'email': new_order.email,
                        'address': new_order.address,
                        'price': new_order.price,
                        'receipt': new_order.receipt,
                        'created_on':new_order.created_on,
                        'seat': seat
                    } 
                })

@app.route('/private-trip/order', methods = ['GET', 'POST'])
def booking_private():
    data = request.json
    if (data and 'name' in data and 'phone' in data and 'email' in data and
         'gender' in data and 'number_guest' in data and
           'departure_day' in data and 'departure_time' in data and 'start' in data and
             'end' in data and 'round_trip' in data and 'car_type' in data):
        guest = data['name'].strip()
        phone = data['phone']
        email = data['email'].strip()
        gender= data['gender'].strip()
        number_guest = data['number_guest']
        departure_day = data['departure_day'].strip()
        departure_time = data['departure_time'].strip()
        start = data['start'].strip()
        end = data['end'].strip()
        round_trip = data['round_trip'] #Bolean True-False
        car_type = data['car_type'].strip()
    else:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    #check if note or None
    if 'note' in data:
        note = data['note']
    else:
        note = 'N/A'

    #check if valid email
    if not is_valid_email(email):
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid Email'
        })

    #check if number_guest suitable for car_type
    car_book = CarType.query.filter_by(name = car_type).first()
    if car_book.seat < int(number_guest):
        return jsonify({
            'status':'FAIL',
            'err':f'{car_type} Does Not Have Enough Seats'
        })
    
    #check if user choose round trip or not
    if round_trip == True:
        if 'back_day' in data and 'back_time' in data:
            back_day = data['back_day']
            back_time = data['back_time']
        else:
            return jsonify({
                'status':'FAIL',
                'err':'Mising Back_Day or Back_Time'
            })

        #check if this order existed?
        order = PrivateOrder.query.filter_by(
            guest=guest,
            phone=phone,
            email=email,
            number_guest=number_guest,
            departure_day=departure_day,
            departure_time=departure_time,
            start=start,
            end=end,
            round_trip=round_trip,
            back_day=back_day,
            back_time=back_time,
            car_id=car_book.id
        ).first()
        
        if order:
            return jsonify({
                'status':'FAIL',
                'err':'Order Has Already Booked'
            })
        
        #Create new private order
        private_order = PrivateOrder(guest = guest, phone = phone, email = email, note = note, number_guest = number_guest, 
                                     departure_day = departure_day, departure_time = departure_time, start = start, gender = gender,
                                     end = end, round_trip = round_trip, back_day = back_day, back_time = back_time, car_id = car_book.id)
        db.session.add(private_order)
        db.session.commit()
        
        #Auto send confimination to User
        auto_send_mail_round("Thank You For Choosing FunRide!", email, guest, phone, gender, number_guest, departure_day,
                             departure_time, start, end, back_day, back_time, car_type, note)
        
        #Auto send mail to company for new ord
        auto_send_mail_round("You Have New Private Round-Trip Order!", "Funride.company.2023@gmail.com", guest, phone, gender, number_guest, departure_day,
                             departure_time, start, end, back_day, back_time, car_type, note)
        
        return jsonify({
            'status':'OK',
            'msg':{
                'name':guest,
                'phone':phone,
                'email':email,
                'note':note,
                'number_guest':number_guest,
                'departure_day':departure_day,
                'deaparture_time':departure_time,
                'start':start,
                'end':end,
                'round_trip':round_trip,
                'back_day':back_day,
                'back_time':back_time,
                'car_type':car_type
            }
        })
    
    #Round Trip = False
    else:
        #check if this order existed?
        order = PrivateOrder.query.filter_by(
            guest=guest,
            phone=phone,
            email=email,
            number_guest=number_guest,
            departure_day=departure_day,
            departure_time=departure_time,
            start=start,
            end=end,
            car_id=car_book.id,
            round_trip=round_trip
        ).first()
        
        if order:
            return jsonify({
                'status':'FAIL',
                'err':'Order Has Already Booked'
            })
        
        #Create new private order
        private_order = PrivateOrder(guest = guest, phone = phone, email = email, note = note, number_guest = number_guest, 
                                        departure_day = departure_day, departure_time = departure_time, start = start, gender = gender,
                                        end = end, round_trip = round_trip, car_id = car_book.id, back_day = None, back_time = None)
        db.session.add(private_order)
        db.session.commit()
        
        #Auto send confimination to User
        auto_send_mail_private("Thank You For Choosing FunRide!", email, guest, phone, gender, number_guest, departure_day,
                                departure_time, start, end, car_type, note)
        
        #Auto send mail to company for new ord
        auto_send_mail_private("You Have New Private Order!", "Funride.company.2023@gmail.com", guest, phone, gender, number_guest, departure_day,
                             departure_time, start, end, car_type, note)

        return jsonify({
            'status':'OK',
            'msg':{
                'name':guest,
                'phone':phone,
                'email':email,
                'note':note,
                'number_guest':number_guest,
                'departure_day':departure_day,
                'departure_time':departure_time,
                'start':start,
                'end':end,
                'car_type':car_type
            }
        })

#Function for validating User email
def is_valid_email(email):
    # Regular Expression for validating email
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    # Check email satisfies or not
    if re.match(email_pattern, email):
        return True
    else:
        return False

#Function for Auto Sending Email to User Booking Seat
def auto_send_mail(message, email, start, end, departure_day, departure_time,
                    arrived_time, guest, gender, phone,
                      address, price, receipt, created_on, seat, car_type, offer_code):
    
    msg = Message(message,
    sender=app.config.get("MAIL_USERNAME"),
    recipients=[email])
    msg.html = render_template("booking_seat.html",
    start = start,
    end = end,
    departure_day = departure_day,
    departure_time = departure_time,
    arrived_time = arrived_time,
    guest = guest,
    gender = gender,
    phone = phone,
    address = address,
    price = price,
    receipt = receipt, 
    created_on = created_on,
    car_type = car_type,
    offer_code = offer_code,
    seat = seat)
    mail.send(msg)

def auto_send_mail_round(message, email, guest, phone, gender, number_guest, departure_day,
                         departure_time, start, end, back_day, back_time, car_type, note):
    
    msg = Message(message,
    sender=app.config.get("MAIL_USERNAME"),
    recipients=[email])
    msg.html = render_template("private_round_trip.html",
    start = start,
    end = end,
    departure_day = departure_day,
    departure_time = departure_time,
    guest = guest,
    gender = gender,
    phone = phone,
    car_type = car_type,
    number_guest = number_guest,
    back_day = back_day,
    back_time = back_time,
    note = note)
    mail.send(msg)

def auto_send_mail_private(message, email, guest, phone, gender, number_guest, departure_day,
                         departure_time, start, end, car_type, note):
    
    msg = Message(message,
    sender=app.config.get("MAIL_USERNAME"),
    recipients=[email])
    msg.html = render_template("private_trip.html",
    start = start,
    end = end,
    departure_day = departure_day,
    departure_time = departure_time,
    guest = guest,
    gender = gender,
    phone = phone,
    car_type = car_type,
    number_guest = number_guest,
    note = note)
    mail.send(msg)
