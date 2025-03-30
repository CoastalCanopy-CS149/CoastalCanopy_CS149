from werkzeug.security import generate_password_hash, check_password_hash
from app.database import get_app_users_collection
class User:
    
    def __init__(self, f_name: str, l_name: str, username: str, email: str, password, role: str, provider: str = "email"):
         self.f_name = f_name
         self.l_name = l_name
         self.username = username
         self.email = email
         self.role = role
         self.password = generate_password_hash(password)
         self.provider = provider

    # find user by email
    def find_user_by_email(email):
        user_collection = get_app_users_collection()
        
        return user_collection.find_one({'email':email})

    # find user by username
    def find_user_by_username(username):
        user_collection = get_app_users_collection()
        return user_collection.find_one({'username': username})
    
    # save new user
    def create_new_user(self):
        print('create new user executed')
        user_collection = get_app_users_collection()
        user_data = {
            "username": self.username,
            "firstName": self.f_name,
            "lastName": self.l_name,
            "email": self.email,
            "role": self.role,
            "password": self.password,
            "provider": self.provider,
            "points": 0,
            "treesPlanted": 0,
            "avatar": "/imgs/gamification/user8.png?height=60&width=60",
            "otp": None,
            "otp_created_at": None,
            "otp_attempts": 0,
            "otp_lock_until": None,
            "is_verified": True if self.provider == "firebase" else False
        }
        return user_collection.insert_one(user_data)
    
    def check_password(user, password):
        return check_password_hash(user['password'], password)
    
    
    @staticmethod
    def update_user(email, updates):
        user_collection = get_app_users_collection()
        user_collection.update_one({"email": email}, {"$set": updates})
        return User.find_user_by_email(email)

    @staticmethod
    def generate_otp():
        import random
        return f"{random.randint(0, 999999):06d}"