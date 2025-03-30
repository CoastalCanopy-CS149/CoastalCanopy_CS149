from flask import Flask
from flask_jwt_extended import create_access_token, decode_token, JWTManager
from datetime import timedelta, datetime
from jwt import ExpiredSignatureError, InvalidTokenError
from app.config import JWT_SECRET_KEY, JWT_NORMAL_EXPIRE, JW_LONGER_LIVE

class JWTHandler:
    def __init__(self, app: Flask):
        self.jwt_manager = JWTManager(app)
        # Fetch JWT configurations from environment variables
        self.secret_key = JWT_SECRET_KEY
        self.default_expires = int(JWT_NORMAL_EXPIRE)  # Default to 3600s (1 hour)
        self.long_expires = int(JW_LONGER_LIVE)       # Longer-lived token duration
        

        # Ensure Flask app uses the same secret key
        app.config['JWT_SECRET_KEY'] = self.secret_key

    def encode_token(self, payload, remember=False) -> str:
        """
        Encode a JWT token with the given payload.
        :param payload: Data to encode in the token (e.g., user ID or email)
        :param remember: If True, use longer expiration; otherwise, use default
        :return: Encoded JWT token string
        """
        expires = self.long_expires if remember else self.default_expires
        expires_delta = timedelta(seconds=expires)
        
        print(f"Encoding token with expiration: {expires} seconds")
        return create_access_token(identity=payload, expires_delta=expires_delta)

    def decode_token(self, token: str) -> tuple[dict, int]:
        """
        Decode a JWT token and return its contents or an error.
        :param token: JWT token string to decode
        :return: Tuple of (response dict, HTTP status code)
        """
        try:
            decoded_data = decode_token(token)
            exp_timestamp = decoded_data.get('exp')
            current_time = datetime.utcnow().timestamp()
            is_expired = exp_timestamp < current_time

            return {
                'status': 'success',
                'data': decoded_data,
                'expired': is_expired,
                'expires_at': datetime.fromtimestamp(exp_timestamp).isoformat()
            }, 200
        except ExpiredSignatureError:
            return {
                'status': 'error',
                'message': 'Token has expired'
            }, 401
        except InvalidTokenError:
            return {
                'status': 'error',
                'message': 'Invalid token'
            }, 401
        except Exception as e:
            return {
                'status': 'error',
                'message': f"Token decoding failed: {str(e)}"
            }, 500

    def validate_and_check_expiration(self, token: str) -> tuple[dict, int]:
        """
        Validate a JWT token and check its expiration status in one function.
        :param token: JWT token string to validate and check
        :return: Tuple of (response dict, HTTP status code)
        """
        try:
            decoded_data = decode_token(token)
            exp_timestamp = decoded_data.get('exp')
            current_time = datetime.utcnow().timestamp()
            is_expired = exp_timestamp < current_time

            if is_expired:
                return {
                    'status': 'error',
                    'message': 'Token has expired',
                    'expired': True,
                    'expires_at': datetime.fromtimestamp(exp_timestamp).isoformat(),
                    'valid': False
                }, 401
            else:
                remaining_seconds = int(exp_timestamp - current_time)
                return {
                    'status': 'success',
                    'message': 'Token is valid',
                    'expired': False,
                    'expires_at': datetime.fromtimestamp(exp_timestamp).isoformat(),
                    'remaining_seconds': remaining_seconds,
                    'valid': True
                }, 200
        except InvalidTokenError:
            return {
                'status': 'error',
                'message': 'Invalid token',
                'expired': None,
                'valid': False
            }, 401
        except Exception as e:
            return {
                'status': 'error',
                'message': f"Token validation failed: {str(e)}",
                'expired': None,
                'valid': False
            }, 500