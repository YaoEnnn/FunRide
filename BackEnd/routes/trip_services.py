from app import app
from flask import request, jsonify
from model import Trip
from datetime import datetime, timedelta

@app.route('/trip/search', methods = ['GET', 'POST'])
def search_trip():
    #get data from user
    data = request.json

    #get current date
    today = datetime.today().date()

    #get current time
    current_time = datetime.combine(datetime.today(), datetime.now().time())

    #verify if enough data?
    if data and 'end' in data and 'departure_day' in data:
        end = data['end']
        departure_day = data['departure_day']
    else:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameter'
        })
    
    #check if user enter unvalid departure day
    if datetime.strptime(departure_day, '%Y-%m-%d').date() < today: #convert String type into Datetime.Date() type
        return jsonify({
            'status':'FAIL',
            'err':'Unvalid Departure Day'
        })
    
    else:
        #Filter trip base on 'end' & 'departure_day' (Just only trips later than current time 1 hour are available)
        trips = Trip.query.filter(Trip.departure_day == departure_day, Trip.end == end,
                                  Trip.departure_time >= (current_time + timedelta(hours = 1)).time()).all()

        #Return all Trips that satisfy requirements
        result = []
        for trip in trips:
            submissions_data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                                'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
            result.append(submissions_data)

        return jsonify({
            'status':'OK',
            'msg': result
        })

#display all trips route
@app.route('/trip/display-all', methods = ['POST'])
def display_all_trip():
    #get current time
    current_time = datetime.combine(datetime.today(), datetime.now().time())

    #get current date
    today = datetime.today().date()
    
    #Filter today trips later than current time 1 hour
    trips_today = Trip.query.filter(Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                              Trip.departure_day == today).all()

    # Filter trips from tomorrow
    trips = Trip.query.filter(Trip.departure_day > today).all()
    
    #Return all Trips that satisfy requirements
    result = []
    for trip in trips_today:
        data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
        result.append(data)
        
    for trip in trips:
        data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
        result.append(data)

    return jsonify({
        'status':'OK',
        'msg': result
    })

#DISTRICT 1 ----> BAOLOC TRIP    
@app.route('/recommend-trip/Q1-BL', methods = ['POST'])
def Q1_BL_Trip():
     return RecommendTrip('District 1, HCMC', 'BaoLoc City')

#BINHTAN DISTRICT ----> BAOLOC TRIP
@app.route('/recommend-trip/BT-BL', methods = ['POST'])
def BT_BL_Trip():
    return RecommendTrip('BinhTan District, HCMC', 'BaoLoc City')

#DISTRICT 1 ---> VUNGTAU TRIP
@app.route('/recommend-trip/Q1-VT', methods = ['POST'])
def Q1_VT_Trip():
    return RecommendTrip('District 1, HCMC', 'VungTau City')

#BINHTAN DISTRICT -----> VUNGTAU TRIP
@app.route('/recommend-trip/BT-VT', methods = ['POST'])
def BT_VT_Trip():
    return RecommendTrip('BinhTan District, HCMC', 'VungTau City')

#BAOLOC -------> DISTRICT 1 TRIP
@app.route('/recommend-trip/BL-Q1', methods = ['POST'])
def BL_Q1_Trip():
    return RecommendTrip('BaoLoc City', 'District 1, HCMC')

#BAOLOC --------> BINHTAN TRIP
@app.route('/recommend-trip/BL-BT', methods = ['POST'])
def BL_BT_Trip():
    return RecommendTrip('BaoLoc City', 'BinhTan District, HCMC')

#VUNGTAU -------> DISTRICT 1 TRIP
@app.route('/recommend-trip/VT-Q1', methods = ['POST'])
def VT_Q1_Trip():
    return RecommendTrip('VungTau City', 'District 1, HCMC')

#VUNGTAU -----> BINHTAN TRIP
@app.route('/recommend-trip/VT-BT', methods = ['POST'])
def VT_BT_Trip():
    return RecommendTrip('VungTau City', 'BinhTan District, HCMC')

#---------------Function Use For Trips Recommendation Filter base on Current DateTime---------------#
def RecommendTrip(begin, des):
    #get current time
    current_time = datetime.combine(datetime.today(), datetime.now().time())

    #get current date
    today = datetime.today().date()
    
    #Filter today trips later than current time 1 hour
    trips_today = Trip.query.filter(Trip.start == begin, Trip.end == des,
                              Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                              Trip.departure_day == today).all()

    # Filter trips from tomorrow
    trips = Trip.query.filter(Trip.start == begin, Trip.end == des,
                              Trip.departure_day > today).all()
    
    #Return all Trips that satisfy requirements
    result = []
    for trip in trips_today:
        data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
        result.append(data)
        
    for trip in trips:
        data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
        result.append(data)

    return jsonify({
        'status':'OK',
        'msg': result
    })
