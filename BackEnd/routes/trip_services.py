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

    all_trips = trips_today + trips
    
    return ReturnTrips(all_trips)

#display 1 trip
@app.route('/trip/get/<trip_id>', methods = ['POST'])
def get_one_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({
            'status':'FAIL',
            'err':'No Trip Found'
        })
    
    data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
    
    return jsonify({
        'status':'OK',
        'msg':data
    })
    
#display trips from user's requirements
@app.route('/trip/order-by-user', methods = ['GET', 'POST'])
def order_by_user():
    #get current time
    current_time = datetime.combine(datetime.today(), datetime.now().time())

    #get current date
    today = datetime.today().date()

    #get data from Front-end
    data = request.json
    if (data and 'start' in data and 'end' in data and 'departure_time' in data
         and 'price' in data and 'car_type' in data and 'departure_day' in data):
        start = data['start']
        end = data['end']
        departure_time = data['departure_time']
        price = data['price']
        car_type = data['car_type']
        departure_day = data['departure_day']
    else:
        return jsonify({
            'status':'FAIL',
            'err':'Missing Parameters'
        })
    
    #user order "departure" from all trips 
    if start is not None and end is None and departure_time is None and price is None and car_type is None and departure_day is None:
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.start == start, Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips_future = Trip.query.filter(Trip.start == start, Trip.departure_day > today).all()

        all_trips = trips_today + trips_future
        return ReturnTrips(all_trips)
    
    #user order "departure" from searched trips
    if (start is not None and end is not None and departure_day is not None 
        and departure_time is None and price is None and car_type is None):

        if departure_day == today:
            #Filter today trips later than current time 1 hour
            trips = Trip.query.filter(Trip.start == start, Trip.end == end,
                                    Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                    Trip.departure_day == today).all()

        else:
            trips = Trip.query.filter(Trip.start == start, Trip.end == end,
                                Trip.departure_day == departure_day).all()
        
        return ReturnTrips(trips)
    
    #user order "departure" from recommended trips
    if (start is not None and end is not None and departure_day is None
        and departure_time is None and price is None and car_type is None):

        return RecommendTrip(start, end)
    
    #user order "car_type" from all trips
    if (start is None and end is None and departure_day is None
        and departure_time is None and price is None and car_type is not None):

        #set car_id
        car_id = 3
        if car_type == "Limousine":
            car_id = 1
        if car_type == "Bus":
            car_id = 2
        
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.car_id ==  car_id,
                                Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.car_id == car_id, Trip.departure_day > today).all()
        
        all_trips = trips_today + trips
        
        #Return all Trips that satisfy requirements
        return ReturnTrips(all_trips)
    
    #user order 'car_type' from searched trips
    if (start is None and end is not None and departure_day is not None
        and departure_time is None and price is None and car_type is not None):

        #set car_id
        car_id = 3
        if car_type == "Limousine":
            car_id = 1
        if car_type == "Bus":
            car_id = 2
        
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.departure_day == departure_day, Trip.end == end, Trip.car_id ==  car_id,
                                Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.departure_day == departure_day, Trip.end == end, 
                                  Trip.car_id == car_id, Trip.departure_day > today).all()
        
        all_trips = trips_today + trips
        
        return ReturnTrips(all_trips)
    
    #user order "car_type" from recommened trip:
    if (start is not None and end is not None and departure_day is None
            and departure_time is None and price is None and car_type is not None):

        #set car_id
        car_id = 3
        if car_type == "Limousine":
            car_id = 1
        if car_type == "Bus":
            car_id = 2
        
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.start == start, Trip.end == end, Trip.car_id ==  car_id,
                                Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.start == start, Trip.end == end, 
                                Trip.car_id == car_id, Trip.departure_day > today).all()
        
        all_trips = trips_today + trips
        
        return ReturnTrips(all_trips)

    #user order "low - High price" from all trips
    if (start is None and end is None and price is not None and
         departure_time is None and car_type is None and departure_day is None):
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.departure_day > today).all()
        
        all_trips = trips + trips_today
        #sort by day firstly
        sorted_day = sorted(all_trips, key=lambda trip: trip.departure_day)
        
        if price == "Price Ascend":
            #sort by asc price
            sorted_price = sorted(sorted_day, key=lambda trip: trip.price)
            
        else:
            #sort by desc price
            sorted_price = sorted(sorted_day, key=lambda trip: trip.price, reverse = True)

        return ReturnTrips(sorted_price)

    #user order "low - High price" from searched trips
    if (start is None and end is not None and price is not None and
         departure_time is None and car_type is None and departure_day is not None):
        
        trips = Trip.query.filter(Trip.departure_day == departure_day, Trip.end == end).all()

        if price == "Price Ascend":
            #sort by asc price
            sorted_price = sorted(trips, key=lambda trip: trip.price)
            
        else:
            #sort by desc price
            sorted_price = sorted(trips, key=lambda trip: trip.price, reverse = True)

        return ReturnTrips(sorted_price)
    
    #user order "low - High price" from recommended trips
    if (start is not None and end is not None and price is not None and
         departure_time is None and car_type is None and departure_day is None):
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.start ==  start, Trip.end == end,
                                        Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                        Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.start ==  start, Trip.end == end, Trip.departure_day > today).all()
        
        all_trips = trips + trips_today
        #sort by day firstly
        sorted_day = sorted(all_trips, key=lambda trip: trip.departure_day)
        
        if price == "Price Ascend":
            #sort by asc price
            sorted_price = sorted(sorted_day, key=lambda trip: trip.price)
            
        else:
            #sort by desc price
            sorted_price = sorted(sorted_day, key=lambda trip: trip.price, reverse = True)

        return ReturnTrips(sorted_price)
    
    #user order "Earliest - Latest" from all trips
    if (start is None and end is None and price is None and
         departure_time is not None and car_type is None and departure_day is None):
        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.departure_day > today).all()
        
        all_trips = trips + trips_today
        #sort by day firstly
        sorted_day = sorted(all_trips, key=lambda trip: trip.departure_day)
        
        if departure_time == "Earliest":
            #sort by asc time
            sorted_time = sorted(sorted_day, key=lambda trip: trip.departure_time)
            
        else:
            #sort by desc time
            sorted_time = sorted(sorted_day, key=lambda trip: trip.departure_time, reverse = True)

        return ReturnTrips(sorted_time)
    
    #user order "Earliest - Latest" from all searched trips
    if (start is None and end is not None and price is None and
         departure_time is not None and car_type is None and departure_day is not None):
        
        trips = Trip.query.filter(Trip.departure_day == departure_day, Trip.end == end).all()

        if departure_time == "Earliest":
            #sort by asc time
            sorted_time = sorted(trips, key=lambda trip: trip.departure_time)
            
        else:
            #sort by desc time
            sorted_time = sorted(trips, key=lambda trip: trip.departure_time, reverse = True)

        return ReturnTrips(sorted_time)
    
    #user order "Earliest - Latest" from recommended trips
    if (start is not None and end is not None and price is None and
        departure_time is not None and car_type is None and departure_day is None):

        #Filter today trips later than current time 1 hour
        trips_today = Trip.query.filter(Trip.start ==  start, Trip.end == end,
                                        Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                                        Trip.departure_day == today).all()

        # Filter trips from tomorrow
        trips = Trip.query.filter(Trip.start ==  start, Trip.end == end, Trip.departure_day > today).all()
        
        all_trips = trips + trips_today
        #sort by day firstly
        sorted_day = sorted(all_trips, key=lambda trip: trip.departure_day)
        
        if departure_time == "Earliest":
            #sort by asc time
            sorted_time = sorted(sorted_day, key=lambda trip: trip.departure_time)
            
        else:
            #sort by desc time
            sorted_time = sorted(sorted_day, key=lambda trip: trip.departure_time, reverse = True)

        return ReturnTrips(sorted_time)
    

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
def RecommendTrip(start, end):
    #get current time
    current_time = datetime.combine(datetime.today(), datetime.now().time())

    #get current date
    today = datetime.today().date()
    
    #Filter today trips later than current time 1 hour
    trips_today = Trip.query.filter(Trip.start == start, Trip.end == end,
                              Trip.departure_time >= (current_time + timedelta(hours=1)).time(),
                              Trip.departure_day == today).all()

    # Filter trips from tomorrow
    trips = Trip.query.filter(Trip.start == start, Trip.end == end,
                              Trip.departure_day > today).all()
    
    all_trips = trips + trips_today
    
    #Return all Trips that satisfy requirements
    result = []
    for trip in all_trips:
        data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
        result.append(data)

    return jsonify({
        'status':'OK',
        'msg': result
    })

def ReturnTrips(all_trips):
    #Return all Trips that satisfy requirements
    result = []
    for trip in all_trips:
        data = {'id': trip.id, 'start': trip.start, 'end': trip.end, 'departure_time': trip.departure_time.strftime("%H:%M"), 
                            'arrived_time': trip.arrived_time, 'price': trip.price, 'departure_day': trip.departure_day, 'car_type': trip.car_type.name}
        result.append(data)

    return jsonify({
        'status':'OK',
        'msg': result
    })
