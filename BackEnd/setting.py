import os

basedir = os.path.abspath(os.path.dirname(__file__))
os.chdir(basedir)

# Database URI string
DATABASE_URI = f"sqlite:///{basedir}/storage.db"

# Session Login Day for User
TOKEN_EXPIRY: int = 15

# Time for Expiry of Token Change Password
RECOVERY_TOKEN_EXPIRY: int = 15

# Default Car Type List
DEFAULT_CAR_TYPE = [
    {
        "name":"Limousine",
        "seat":9
    },
    {
        "name":"Bus",
        "seat":28
    },
    {
        "name":"Sleeper-Bus",
        "seat":17
    }
]

# Default Everyday Trip List
DEFAULT_TRIP_LIST = [
    {
        "start":"District 1, HCMC",
        "end":"BaoLoc City",
        "departure_time":"6:00",
        "arrived_time":"10:00",
        "price":400000,
        "car_type":1
    },
    {
        "start":"BinhTan District, HCMC",
        "end":"BaoLoc City",
        "departure_time":"6:30",
        "arrived_time":"10:30",
        "price":400000,
        "car_type":1
    },
    {
        "start":"BaoLoc City",
        "end":"District 1, HCMC",
        "departure_time":"10:30",
        "arrived_time":"14:30",
        "price":400000,
        "car_type":1
    },
    {
        "start":"BaoLoc City",
        "end":"BinhTan District, HCMC",
        "departure_time":"11:00",
        "arrived_time":"15:00",
        "price":400000,
        "car_type":1
    },
    {
        "start":"District 1, HCMC",
        "end":"VungTau City",
        "departure_time":"8:00",
        "arrived_time":"11:00",
        "price":250000,
        "car_type":1
    },
    {
        "start":"BinhTan District, HCMC",
        "end":"VungTau City",
        "departure_time":"8:30",
        "arrived_time":"11:30",
        "price":250000,
        "car_type":1
    },
    {
        "start":"VungTau City",
        "end":"District 1, HCMC",
        "departure_time":"11:30",
        "arrived_time":"14:30",
        "price":250000,
        "car_type":1
    },
    {
        "start":"VungTau City",
        "end":"BinhTan District, HCMC",
        "departure_time":"12:00",
        "arrived_time":"15:00",
        "price":250000,
        "car_type":1
    },
    {
        "start":"District 1, HCMC",
        "end":"BaoLoc City",
        "departure_time":"10:00",
        "arrived_time":"14:00",
        "price":300000,
        "car_type":2
    },
    {
        "start":"BinhTan District, HCMC",
        "end":"BaoLoc City",
        "departure_time":"10:30",
        "arrived_time":"14:30",
        "price":300000,
        "car_type":2
    },
    {
        "start":"BaoLoc City",
        "end":"District 1, HCMC",
        "departure_time":"14:30",
        "arrived_time":"18:30",
        "price":300000,
        "car_type":2
    },
    {
        "start":"BaoLoc City",
        "end":"BinhTan District, HCMC",
        "departure_time":"15:00",
        "arrived_time":"19:00",
        "price":300000,
        "car_type":2
    },
    {
        "start":"District 1, HCMC",
        "end":"VungTau City",
        "departure_time":"11:00",
        "arrived_time":"14:00",
        "price":200000,
        "car_type":2
    },
    {
        "start":"BinhTan District, HCMC",
        "end":"VungTau City",
        "departure_time":"11:30",
        "arrived_time":"14:30",
        "price":200000,
        "car_type":2
    },
    {
        "start":"VungTau City",
        "end":"District 1, HCMC",
        "departure_time":"14:30",
        "arrived_time":"17:30",
        "price":200000,
        "car_type":2
    },
    {
        "start":"VungTau City",
        "end":"BinhTan District, HCMC",
        "departure_time":"15:00",
        "arrived_time":"18:00",
        "price":200000,
        "car_type":2
    },
    {
        "start":"District 1, HCMC",
        "end":"BaoLoc City",
        "departure_time":"12:00",
        "arrived_time":"16:00",
        "price":350000,
        "car_type":3
    },
    {
        "start":"BinhTan District, HCMC",
        "end":"BaoLoc City",
        "departure_time":"12:30",
        "arrived_time":"16:30",
        "price":350000,
        "car_type":3
    },
    {
        "start":"BaoLoc City",
        "end":"District 1, HCMC",
        "departure_time":"16:30",
        "arrived_time":"20:30",
        "price":350000,
        "car_type":3
    },
    {
        "start":"BaoLoc City",
        "end":"BinhTan District, HCMC",
        "departure_time":"17:00",
        "arrived_time":"21:00",
        "price":350000,
        "car_type":3
    },
    {
        "start":"District 1, HCMC",
        "end":"VungTau City",
        "departure_time":"16:30",
        "arrived_time":"19:30",
        "price":280000,
        "car_type":3
    },
    {
        "start":"BinhTan District, HCMC",
        "end":"VungTau City",
        "departure_time":"17:00",
        "arrived_time":"20:00",
        "price":280000,
        "car_type":3
    },    
    {
        "start":"VungTau City",
        "end":"District 1, HCMC",
        "departure_time":"20:00",
        "arrived_time":"23:00",
        "price":280000,
        "car_type":3
    },
    {
        "start":"VungTau City",
        "end":"BinhTan District, HCMC",
        "departure_time":"20:30",
        "arrived_time":"23:30",
        "price":280000,
        "car_type":3
    }
]