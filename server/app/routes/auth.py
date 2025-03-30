from flask import Blueprint, current_app, request, jsonify

from app.services.auth_service import AuthService



auth_bp = Blueprint('auth', __name__,url_prefix='/auth', template_folder='templates')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    remember = data['remember'] if 'remember' in data else False
    if data is None:
        return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400
    
    if not email or not password:
            return jsonify({'status': 'error', 'message': 'Email and password are required'}), 400
    auth_service = current_app.auth_service
    response_message, status_code = auth_service.login_user(email, password, remember)
    return jsonify(response_message), status_code

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data['username']
    f_name = data['firstName']
    l_name = data['lastName']
    email = data['email']
    password = data['password']
    role = data['role']
    

    try:
        auth_service = current_app.auth_service
        result, status_code = auth_service.register_user(l_name, f_name, username, email, password, role)
        return jsonify(result), status_code
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@auth_bp.route('/forget-password', methods=['POST'])
def forget_password():
    data = request.get_json()
    try:
        auth_service = current_app.auth_service
        result, status_code = auth_service.forgot_password(data['email'])
        return jsonify(result), status_code
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'Server error', 'error': str(e)}), 500


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')
        otp = data.get('otp')

        if not email or not otp:
            return jsonify({'status': 'error', 'message': 'Email and OTP are required'}), 400

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.verify_otp(email, otp)
        return jsonify(response_message), status_code
    except KeyError as e:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')

        if not email:
            return jsonify({'status': 'error', 'message': 'Email is required'}), 400

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.resend_otp(email)
        return jsonify(response_message), status_code
    except KeyError as e:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')
        provider = data.get('provider')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        username = data.get('username')
        role = data.get('role')
        print(email, provider, first_name, last_name, username , role)

        if not email or not provider or not first_name or not last_name or not username:
            return jsonify({'status': 'error', 'message': 'Email/Provider/First Name/Last Name/Username is required'}), 400

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.google_login(first_name, last_name, email, username, provider, role)
        return jsonify(response_message), status_code
    except KeyError as e:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400
    


@auth_bp.route('/verify-otp-reset-password', methods=['POST'])
def verify_otp_reset():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')
        otp = data.get('otp')

        if not email or not otp:
            return jsonify({'status': 'error', 'message': 'Email and OTP are required'}), 400

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.verify_otp_reset(email, otp)
        return jsonify(response_message), status_code
    except KeyError as e:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
# reset password
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'status': 'error', 'message': 'Email and Password are required'}), 400

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.reset_password(email, password)
        return jsonify(response_message), status_code
    except KeyError as e:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# check current password
@auth_bp.route('/check-current-password', methods=['POST'])
def check_current_password():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')
        current_password = data.get('password')

        if not email or not current_password:
            return jsonify({'status': 'error', 'message': 'Email and Current Password are required'}), 400

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.check_current_password(email, current_password)
        return jsonify(response_message), status_code
    except KeyError as e:    
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400
    

# update user details first name last name email and username
@auth_bp.route('/update-user-details', methods=['POST'])
def update_user_details():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data provided'}), 400

        email = data.get('email')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        username = data.get('username')

        

        auth_service = current_app.auth_service
        response_message, status_code = auth_service.update_user_details(email, first_name, last_name, username)
        return jsonify(response_message), status_code
    except KeyError as e:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(e)}'}), 400


# verify token
@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    try:
        data = request.get_json()
        if not data or 'accessToken' not in data:
            return jsonify({'status': 'error', 'message': 'Access token is required'}), 400

        token = data['accessToken']
        


        response, status_code =  current_app.auth_service.verify_token(token)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error verifying token: {str(e)}'}), 500