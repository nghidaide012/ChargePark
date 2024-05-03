from django.contrib import admin
from .models import ParkingLot, ChargeStation, Spot, User, Vehicle, ElectricVehicleInfo, ParkingHistory

admin.site.register(ParkingLot)
admin.site.register(ChargeStation)
admin.site.register(Spot)
admin.site.register(User)
admin.site.register(Vehicle)
admin.site.register(ElectricVehicleInfo)
admin.site.register(ParkingHistory)
