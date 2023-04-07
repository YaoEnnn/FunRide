from app import app
import routes
from model import db, generate_default_trips, generate_default_car_type
from os import path
from setting import basedir
from sqlalchemy import text
import schedule

if __name__ == "__main__":
    if not path.exists(f"{basedir}/storage.db"):
        with app.app_context():
            db.create_all()
            db.session.execute(text("PRAGMA foreign_keys = ON"))
            print("Database Created")

    with app.app_context():
        generate_default_car_type()
        generate_default_trips()

    ################
    schedule.every().day.at("10:30").do(generate_default_trips)

    app.run(debug=True, port=5000)