import requests
from requests.auth import HTTPBasicAuth
from . import models
from django.http import Http404

class ForgeRockTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        print('Cookies:')
        for i in request.COOKIES:
            print(i, ':', request.COOKIES[i])
        print('token:', request.headers.get('id-token'))

        id_token = request.headers.get('id-token')
        if not id_token:
            request.user = None
            response = self.get_response(request)
            return response
        else:
            user_info = self.get_user_info(id_token)
            print('User info:', user_info)
            # Create user based on user_info
            if user_info:
                if models.User.objects.filter(email=user_info['email']).exists():
                    user = models.User.objects.get(email=user_info['email'])
                else:
                    user = models.User.objects.create(
                        email=user_info['email'],
                        first_name=user_info['given_name'],
                        last_name=user_info['family_name'],
                        role=user_info['role']
                    )
            else:
                user = None
            request.user = user
        response = self.get_response(request)
        return response
        

    def get_user_info(self, id_token):  
        session_url = f'http://chargepark.example.be:8080/am/oauth2/userinfo'
        session_headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-API-Version': 'resource=2.0, protocol=1.0',
            'Authorization': f'Bearer {id_token}'
        }
        session_data = {
            'token': id_token
        }
        session_response = requests.post(session_url, headers=session_headers)
        return session_response.json()