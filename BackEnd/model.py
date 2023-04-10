from app import app
from setting import DATABASE_URI, TOKEN_EXPIRY, RECOVERY_TOKEN_EXPIRY, DEFAULT_TRIP_LIST, DEFAULT_CAR_TYPE
from flask_sqlalchemy import SQLAlchemy
from random import randint
from datetime import timedelta, datetime
import uuid
from secrets import token_urlsafe
from werkzeug.security import generate_password_hash

#Configuration and Database Setting
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
db = SQLAlchemy(app)

#-------------------Model Design------------------#

class CarType(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable = False)
    seat = db.Column(db.Integer, nullable = False)

    trip_ref = db.relationship('Trip', backref = 'car_type', lazy=True, cascade = 'all, delete')

    def __init__(self, name, seat):
        self.name = name
        self.seat = seat

class Trip(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    start = db.Column(db.String(100), nullable = False)
    end = db.Column(db.String(100), nullable = False)
    departure_time = db.Column(db.Time, nullable = False)
    arrived_time = db.Column(db.String(50), nullable = False)
    price = db.Column(db.Integer, nullable = False)
    departure_day = db.Column(db.String(50), nullable = False)
    car_id = db.Column(db.Integer, db.ForeignKey("car_type.id"), nullable = False)

    order_ref = db.relationship('Order', backref = 'trip', lazy=True, cascade = 'all, delete')

    def __init__(self, start, end, departure_time, arrived_time, price, departure_day, car_id):
        self.start = start
        self.end = end
        self.departure_time = departure_time
        self.arrived_time = arrived_time
        self.price = price
        self.departure_day = departure_day
        self.car_id = car_id

class Order(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    guest = db.Column(db.String(100), nullable = False)
    gender = db.Column(db.String(50), nullable = False)
    phone = db.Column(db.Integer, nullable = False)
    email = db.Column(db.String(100), nullable = False)
    address = db.Column(db.String(200), nullable = False)
    receipt = db.Column(db.Text, nullable = False, unique = True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trip.id"), nullable = False)
    price = db.Column(db.Integer, nullable = False)
    created_on = db.Column(db.DateTime, default = db.func.now())
    offer_id = db.Column(db.Integer, db.ForeignKey("offer.id"), nullable = True)

    seat_ref = db.relationship('Seat', backref = 'order', lazy=True, cascade = 'all, delete')

    def __init__(self, guest, gender, phone, email, address, trip_id, price, offer_id):
        self.guest = guest
        self.gender = gender
        self.phone = phone
        self.email = email
        self.address = address
        self.trip_id = trip_id
        self.receipt = uuid.uuid4().hex
        self.price = price
        self.offer_id = offer_id

class Seat(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    seat_number = db.Column(db.Integer, nullable = False)
    trip_id = db.Column(db.Integer, db.ForeignKey("trip.id"), nullable = False)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable = False)

    def __init__(self, seat_number, trip_id, order_id):
        self.seat_number = seat_number
        self.trip_id = trip_id
        self.order_id = order_id

class PrivateOrder(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    guest = db.Column(db.String(100), nullable = False)
    phone = db.Column(db.Integer, nullable = False)
    email = db.Column(db.String(100), nullable = False)
    gender = db.Column(db.String(50), nullable = False)
    note = db.Column(db.Text, nullable = True)
    number_guest = db.Column(db.Integer, nullable = False)
    departure_day = db.Column(db.String(50), nullable = False)
    departure_time = db.Column(db.String(50), nullable = False)
    start = db.Column(db.String(200), nullable = False)
    end = db.Column(db.String(200), nullable = False)
    round_trip = db.Column(db.Boolean, nullable = False)
    back_day = db.Column(db.String(50), nullable = True)
    back_time = db.Column(db.String(50), nullable = True)
    car_id = db.Column(db.Integer, db.ForeignKey("car_type.id"), nullable = False)

    def __init__(self, guest, phone, email, gender, note, number_guest, departure_day, departure_time,
                 start, end, round_trip, back_day, back_time, car_id):
        self.guest = guest
        self.phone = phone
        self.email = email
        self.gender = gender
        self.note = note
        self.number_guest = number_guest
        self.departure_day = departure_day
        self.departure_time = departure_time
        self.start = start
        self.end = end
        self.round_trip = round_trip
        self.back_day = back_day 
        self.back_time = back_time
        self.car_id = car_id

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_name = db.Column(db.String(50), nullable = False)
    password = db.Column(db.String(100), nullable = False)
    name = db.Column(db.String(100), nullable = False)
    gender = db.Column(db.String(50), default = "Unknown", nullable = False)
    email = db.Column(db.String(100), nullable = False)
    phone = db.Column(db.Integer, nullable = False)
    address = db.Column(db.String(150), default = "Unknown", nullable = False)

    def __init__(self, user_name, password, name, email, phone):
        self.user_name = user_name.strip()
        self.password = generate_password_hash(password).strip()
        self.name = name
        self.phone = phone
        self.email = email

class Session(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    token = db.Column(db.String(100), nullable = False, unique = True)
    expiry_day = db.Column(db.DateTime, default= datetime.now() + timedelta(days = TOKEN_EXPIRY))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)

    def __init__(self, user_id) -> None:
        self.user_id = user_id
        self.token = token_urlsafe(100)

class RecoveryPassword(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
    code = db.Column(db.Integer, nullable = False)
    url_token = db.Column(db.String(100), unique = True, nullable = False)
    expiry_time = db.Column(db.DateTime, default = datetime.now() + timedelta(minutes = RECOVERY_TOKEN_EXPIRY))

    def __init__(self, user_id):
        self.user_id = user_id
        self.code = randint(100000, 999999)
        self.url_token = token_urlsafe(100)

class Offer(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    code = db.Column(db.String(10), nullable = False, unique = True)
    discount = db.Column(db.Integer, nullable = False)
    available = db.Column(db.Integer, nullable = False)
    created_on = db.Column(db.DateTime, default = db.func.now())

    def __init__(self, code, discount, available):
        self.code = code
        self.discount = discount
        self.available = available

def generate_default_car_type():
    for record in DEFAULT_CAR_TYPE:
        if not CarType.query.filter_by(name = record["name"]).first():
            new_car_type = CarType(record["name"], record["seat"])
            db.session.add(new_car_type)
            db.session.commit()

def generate_default_trips():
    today = datetime.today().date()
    for i in range(15):
        departure_day = today + timedelta(days=i)
        if Trip.query.filter_by(departure_day=str(departure_day)).first():
            continue
        for record in DEFAULT_TRIP_LIST:
            trip = Trip(
                start = record['start'],
                end = record['end'],
                departure_time = record['departure_time'],
                arrived_time = record['arrived_time'],
                price = record['price'],
                car_id = record['car_type'],
                departure_day = departure_day
            )
            db.session.add(trip)
            db.session.commit()

