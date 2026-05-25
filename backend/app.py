from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"}), 200

    # Register blueprints
    from routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()
        try:
            from sqlalchemy import text
            db.session.execute(text("ALTER TABLE user ADD COLUMN shift VARCHAR(20) DEFAULT 'Morning'"))
            db.session.commit()
        except Exception:
            db.session.rollback()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
