import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from django.utils import timezone

class SpotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.ping_task = asyncio.create_task(self.send_ping())
        await self.channel_layer.group_add("parking_status", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        print('Disconnected:', close_code)
        await self.channel_layer.group_discard("parking_status", self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print('Received:', message)
        await self.channel_layer.group_send(
            "parking_status",
            {
                'type': 'send_message',
                'message': message
            }
        )

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))


    async def send_ping(self):
        while True:
            await asyncio.sleep(5)
            parking_histories = await self.check_parking()
            if parking_histories:
                for parking_history in parking_histories:
                    await self.channel_layer.group_send(
                        "parking_status",
                        {
                            'type': 'send_message',
                            'message': f'{parking_history}'
                        }
                    )
            else:
                await self.send(text_data=json.dumps({
                    'ping': 'ping'
                }))
    
    @database_sync_to_async
    def check_parking(self):
        from .models import ParkingHistory
        parking_histories = ParkingHistory.objects.filter(is_parking=True, end_time__lte=timezone.now())
        parkingspaceList  = []
        for parking_history in parking_histories:
            parking_history.is_parking = False
            parking_history.save()
            parkingspaceList.append(parking_history.parking_spot.id)
        return parkingspaceList