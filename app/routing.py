from django.urls import re_path
from . import consumers
from channels.routing import ProtocolTypeRouter, URLRouter

application = ProtocolTypeRouter({
    'websocket': URLRouter([
        re_path('ws/spot/', consumers.SpotConsumer.as_asgi()),
    ]),
})