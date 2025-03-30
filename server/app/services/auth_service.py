
from datetime import datetime, timedelta

from flask import current_app
from flask_mail import Mail, Message
from app.models.user_model import User
from app.utils.jwt_util import JWTHandler
from werkzeug.security import generate_password_hash, check_password_hash


class AuthService:
    def __init__(self,jwt_handler):
        self.jwt_handler = jwt_handler
    
    # register new user
    @staticmethod
    def register_user(f_name, l_name, username, email, password, role):
        try:
            if User.find_user_by_email(email):
                return {"status": "error", "message": "Email already exists"}, 400

            user = User(f_name, l_name, username, email, password, role)
            new_user = user.create_new_user()
            print(new_user)
            otp = user.generate_otp()
            user.update_user(email, {
                "otp": otp,
                "otp_created_at": datetime.utcnow(),
                "otp_attempts": 0
            })

            # Send OTP email
            msg = Message("Your OTP Code", 
                         sender=current_app.config['MAIL_USERNAME'],
                         recipients=[email])
            msg.body = f"Your OTP code is: {otp}. It expires in 10 minutes."
            current_app.mail.send(msg)

            return {"status": "success", "message": "User registered. Please verify OTP sent to your email."}, 201
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    def verify_otp(self, email, otp):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            if user["is_verified"]:
                return {"status": "error", "message": "User already verified"}, 400

            now = datetime.utcnow()
            lock_until = user.get("otp_lock_until")

            # Check if account is locked
            if lock_until and now < lock_until:
                remaining = (lock_until - now).total_seconds() 
                return {"status": "error", "message": f"Account locked. Try again in {int(remaining)} minutes"}, 429

            # Check OTP validity
            otp_created = user.get("otp_created_at")
            if not otp_created or now > otp_created + timedelta(minutes=7):
                return {"status": "error", "message": "OTP expired. Please request a new one"}, 400

            if user["otp"] != otp:
                attempts = user["otp_attempts"] + 1
                updates = {"otp_attempts": attempts}
                if attempts >= 3:
                    updates["otp_lock_until"] = now + timedelta(minutes=10)
                    updates["otp_attempts"] = 0  # Reset attempts after lock
                User.update_user(email, updates)
                return {"status": "error", "message": "Invalid OTP"}, 401

            # OTP is valid
            User.update_user(email, {
                "is_verified": True,
                "otp": None,
                "otp_created_at": None,
                "otp_attempts": 0,
                "otp_lock_until": None
            })
            return {"status": "success", "message": "Email verified successfully"}, 200

        except Exception as e:
            return {"status": "error", "message": str(e)}, 500

    def resend_otp(self, email):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            if user["is_verified"]:
                return {"status": "error", "message": "User already verified"}, 400
            print(user)
            now = datetime.utcnow()
            lock_until = user.get("otp_lock_until")
            if lock_until and now < lock_until:
                remaining = (lock_until - now).total_seconds() 
                return {"status": "error", "message": f"Account locked. Try again in {int(remaining)} minutes"}, 429

            if user["otp_attempts"] >= 3:
                User.update_user(email, {"otp_lock_until": now + timedelta(minutes=10), "otp_attempts": 0})
                return {"status": "error", "message": "Too many attempts. Account locked for 10 minutes"}, 429

            otp = User.generate_otp()
            User.update_user(email, {
                "otp": otp,
                "otp_created_at": now,
                "otp_attempts": user["otp_attempts"] + 1
            })

            # Send OTP email
            msg = Message("Your New OTP Code", 
                         sender=current_app.config['MAIL_USERNAME'],
                         recipients=[email])
            msg.body = f"Your new OTP code is: {otp}. It expires in 10 minutes."
            current_app.mail.send(msg)

            return {"status": "success", "message": "New OTP sent to your email"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500

    # login user
    def login_user(self,email, password, remember):
        print(email, password, remember)
        try:
            user = User.find_user_by_email(email)
            if not user["is_verified"]:
                return {"status": "error", "message": "Please verify your email first"}, 403
            if user and User.check_password(user, password):
                token = self.jwt_handler.encode_token(user['username'], remember)
                user_data = {
                    "username": user['username'],
                    "firstName": user['firstName'],
                    "lastName": user['lastName'],
                    "email": user['email'],
                    "role": user['role']
                }
                return {"status": "success", "data": {"token": token , "user": user_data}}, 200
            else:
                return {"status": "error", "message": "Invalid email or password"}, 401
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    # google login
    
    def google_login(self, first_name, last_name, email, username, provider, role):
        try:
           
            new_user = User.find_user_by_email(email)
            # print('is user', new_user)
            if not new_user :
                user = User(
                f_name=first_name,
                l_name=last_name,
                username=username,
                email=email,
                password="*",  # No password for SSO users
                role=role,
                provider=provider
                )
                res = user.create_new_user()
                print(res)
            token = self.jwt_handler.encode_token(username, False)
            print('token', token)
            user_data = {
                "username": username,
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
                "role": role
            }
            if new_user:
                user_data = {
                    "username": new_user['username'],
                    "firstName": new_user['firstName'],
                    "lastName": new_user['lastName'],
                    "email": new_user['email'],
                    "role": new_user['role']
                }
            return {"status": "success", "data": {"token": token , "user": user_data}}, 200

        except Exception as e:
            print(e)
            return {"status": "error", "message": str(e)}, 500

    # forgot password
    def forgot_password(self, email):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            
            otp = User.generate_otp()
            User.update_user(email, {
                "otp": otp,
                "otp_created_at": datetime.utcnow(),
                "otp_attempts": 0
            })
            # Check if OTP attempts are less than 5
            if user["otp_attempts"] >= 5:
                return {"status": "error", "message": "Too many OTP requests. Please try again later."}, 429

            # Send OTP email
            msg = Message("Your New OTP Code", 
                         sender=current_app.config['MAIL_USERNAME'],
                         recipients=[email])
            msg.body = f"Your new OTP code is: {otp}. It expires in 7 minutes. Please use it to reset your password."
            current_app.mail.send(msg)
            user["otp_attempts"] += 1
            User.update_user(email, {"otp_attempts": user["otp_attempts"]})

            return {"status": "success", "message": "New OTP sent to your email"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
    
    def verify_otp_reset(self, email, otp):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            

            now = datetime.utcnow()
            lock_until = user.get("otp_lock_until")

            # Check if account is locked
            if lock_until and now < lock_until:
                remaining = (lock_until - now).total_seconds() 
                return {"status": "error", "message": f"Account locked. Try again in {int(remaining)} minutes"}, 429

            # Check OTP validity
            otp_created = user.get("otp_created_at")
            if not otp_created or now > otp_created + timedelta(minutes=7):
                return {"status": "error", "message": "OTP expired. Please request a new one"}, 400

            if user["otp"] != otp:
                attempts = user["otp_attempts"] + 1
                updates = {"otp_attempts": attempts}
                if attempts >= 3:
                    updates["otp_lock_until"] = now + timedelta(minutes=10)
                    updates["otp_attempts"] = 0  # Reset attempts after lock
                User.update_user(email, updates)
                return {"status": "error", "message": "Invalid OTP"}, 401

            # OTP is valid
            User.update_user(email, {
                "is_verified": True,
                "otp": None,
                "otp_created_at": None,
                "otp_attempts": 0,
                "otp_lock_until": None
            })
            return {"status": "success", "message": "Email verified successfully"}, 200

        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    # reset password
    def reset_password(self, email, password):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            if not user["is_verified"]:
                return {"status": "error", "message": "User not verified"}, 400
            hashed_password = generate_password_hash(password)
            User.update_user(email, {"password": hashed_password})
            return {"status": "success", "message": "Password reset successfully"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
    
    # check current password
    def check_current_password(self, email, current_password):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            if not user["is_verified"]:
                return {"status": "error", "message": "User not verified"}, 400
            if not User.check_password(user, current_password):
                return {"status": "error", "message": "Invalid current password"}, 401
            return {"status": "success", "message": "Password matches"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    # update user details
    def update_user_details(self, email, first_name, last_name, username):
        try:
            user = User.find_user_by_email(email)
            if not user:
                return {"status": "error", "message": "User not found"}, 404
            if not user["is_verified"]:
                return {"status": "error", "message": "User not verified"}, 400
            User.update_user(email, {"firstName": first_name, "lastName": last_name, "username": username})
            return {"status": "success", "message": "User details updated successfully"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    # verify token
    def verify_token(self, token):
        try:
            data = self.jwt_handler.validate_and_check_expiration(token)
            return {"status": "success", "message": data}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
