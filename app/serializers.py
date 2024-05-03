from rest_framework import serializers
from .models import ParkingLot, ChargeStation, Spot, User, Vehicle, ElectricVehicleInfo, ParkingHistory






class ParkingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingHistory
        fields = '__all__'
        extra_kwargs = {
            'id': {'read_only': True},
        }


class ElectricVehicleInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricVehicleInfo
        fields = '__all__'
        extra_kwargs = {
            'id': {'read_only': True},
        }

class VehicleSerializer(serializers.ModelSerializer):
    electric_info = ElectricVehicleInfoSerializer(many=False, read_only=True)
    class Meta:
        model = Vehicle
        fields = ['id', 'user', 'plate_number', 'color', 'is_electric', 'electric_info']
        extra_kwargs = {
            'id': {'read_only': True},
        }


class UserSerializer(serializers.ModelSerializer):
    vehicles = VehicleSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'role', 'is_active', 'vehicles', 'created_at', 'updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'role': {'read_only': True},
        }

class ChargeStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargeStation
        fields = '__all__'
        extra_kwargs = {
            'id': {'read_only': True},
        }

class SpotSerializer(serializers.ModelSerializer):
    is_parking = Spot.is_parking
    parking_history = ParkingHistorySerializer(many=True, read_only=True)
    class Meta:
        model = Spot
        fields = ['id', 'ParkingLot', 'position', 'direction', 'is_charge', 'is_active', 'ChargeStation', 'is_parking', 'parking_history']
        extra_kwargs = {
            'id': {'read_only': True},
        }
class ParkingLotSerializer(serializers.ModelSerializer):
    parking_spaces = SpotSerializer(many=True, read_only=True)
    total_space = ParkingLot.total_space
    available_space = ParkingLot.available_space
    
    class Meta:
        model = ParkingLot
        fields = ['id', 'company', 'address', 'icon', 'total_space', 'available_space', 'model_path', 'position', 'parking_spaces']
        extra_kwargs = {
            'id': {'read_only': True},
        }