from django.db import models
import uuid
from django.utils.timezone import now

class ParkingLot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.CharField(max_length=100)
    icon = models.FileField(upload_to='images/')
    address = models.TextField()
    model_path = models.FileField(upload_to='models/')
    position = models.CharField(max_length=100, default='0,0,0')

    def __str__(self):
        return self.company
    def total_space(self):
        return Spot.objects.filter(ParkingLot=self, is_active=True).count()
    def available_space(self):
        return Spot.objects.filter(ParkingLot=self, is_active=True).exclude(parking_history__is_parking=False).count()

class ChargeStation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=100)
    power = models.FloatField()
    type_image = models.FileField(upload_to='images/')

class Spot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ParkingLot = models.ForeignKey(ParkingLot, related_name='parking_spaces', on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    direction = models.FloatField()
    is_charge = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    ChargeStation = models.ForeignKey(ChargeStation, on_delete=models.SET_NULL, null=True)

    def is_parking(self):
        return ParkingHistory.objects.filter(parking_spot=self, is_parking=True).exists()
    

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=100, null=True, blank=True)
    role = models.CharField(max_length=100, default='employee')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.first_name + ' ' + self.last_name

class Vehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User,related_name='vehicles', on_delete=models.CASCADE)
    plate_number = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    is_electric = models.BooleanField(default=False)

class ElectricVehicleInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.OneToOneField(Vehicle,related_name='electric_info', on_delete=models.CASCADE)
    charge_port = models.CharField(max_length=100)
    capacity = models.FloatField()

class ParkingHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    parking_spot = models.ForeignKey(Spot,related_name='parking_history', on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=now)
    end_time = models.DateTimeField(null=True, blank=True)
    is_parking = models.BooleanField(default=True)
    duration = models.DurationField(null=True, blank=True) 