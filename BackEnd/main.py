from app import app
import routes
from model import db, generate_default_trips, generate_default_car_type, generate_default_role, generate_default_user
from os import path
from setting import basedir
from sqlalchemy import text
import schedule

if __name__ == "__main__":
    with app.app_context():
        if not path.exists(f"{basedir}/storage.db"):
            db.create_all()
            generate_default_car_type()
            generate_default_trips()
            generate_default_role()
            generate_default_user()
            db.session.execute(text("PRAGMA foreign_keys = ON"))
            print("Database Created")

        schedule.every().day.at("10:30").do(generate_default_trips)

        app.run(debug=True, port=5000)