from app import create_app
from models import db, User

app = create_app()
with app.app_context():
    admin_user = User.query.filter_by(username='admin').first()
    if not admin_user:
        new_admin = User(username='admin', email='admin@dairymart.com', role='admin')
        new_admin.set_password('admin123')
        db.session.add(new_admin)
        db.session.commit()
        print("Admin user created! Username: admin | Password: admin123")
    else:
        print("Admin user already exists.")
