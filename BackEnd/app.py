from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from setting import MAIL_SETTING

app = Flask(__name__)

CORS(app)
# Allowing Cross-Origin-Resource-Sharing from the frontend

app.config.update(MAIL_SETTING)
mail = Mail(app)
