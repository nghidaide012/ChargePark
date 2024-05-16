from django.forms import model_to_dict
from django.utils import timezone
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .serializers import ParkingLotSerializer, ChargeStationSerializer, SpotSerializer, UserSerializer, VehicleSerializer, ElectricVehicleInfoSerializer, ParkingHistorySerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from . import models


def UserRole(request):
    if request.user:
        print(request.user.role)
        return JsonResponse({"role": request.user.role})
    return HttpResponse(status=403)

class ParkinglotManager(viewsets.ModelViewSet):
    queryset = models.ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer

    def list(self, request, *args, **kwargs):
        queryset = models.ParkingLot.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        for data in serializer.data:
            data.pop('parking_spaces')
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        result = models.ParkingLot.objects.get(id=kwargs['pk'])
        serializer = self.serializer_class(result)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class Parkinglot(viewsets.ModelViewSet):
    queryset = models.ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer

    def list(self, request, *args, **kwargs):
        queryset = models.ParkingLot.objects.all()
        print('time',timezone.now())
        serializer = self.serializer_class(queryset, many=True)
        for data in serializer.data:
            for space in data['parking_spaces']:
                space.pop('parking_history')
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)
    def retrieve(self, request, *args, **kwargs):
        result = models.ParkingLot.objects.get(id=kwargs['pk'])
        serializer = self.serializer_class(result)
        for data in serializer.data['parking_spaces']:
            data.pop('parking_history')
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)        

    def destroy(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)
        
class Chargestation(viewsets.ModelViewSet):
    queryset = models.ChargeStation.objects.all()
    serializer_class = ChargeStationSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

class ChargestationManager(viewsets.ModelViewSet):
    queryset = models.ChargeStation.objects.all()
    serializer_class = ChargeStationSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class SpotManager(viewsets.ModelViewSet):
    queryset = models.Spot.objects.all()
    serializer_class = SpotSerializer

    def list(self, request, *args, **kwargs):
        queryset = models.Spot.objects.all()

        serializer = self.serializer_class(queryset, many=True)
        if True:
            for data in serializer.data:
                data.pop('parking_history')
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        result = models.Spot.objects.get(id=kwargs['pk'])
        serializer = self.serializer_class(result)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class Spot(viewsets.ModelViewSet):
    queryset = models.Spot.objects.all()
    serializer_class = SpotSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset, many=True)
        if True:
            for data in serializer.data:
                data.pop('parking_history')
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def retrieve(self, request, *args, **kwargs):
        result = models.Spot.objects.get(id=kwargs['pk'])
        serializer = self.serializer_class(result)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def partial_update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def destroy(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

class UserManager(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        queryset = models.User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return super().list(request, *args, **kwargs)
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class User(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        if(request.user):
            result = models.User.objects.get(id=request.user.id)
            serializer = self.serializer_class(result)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("No idea who you are", status.HTTP_403_FORBIDDEN)

    def create(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        query = models.User.objects.get(id=kwargs['pk'])
        if request.user.id != query.id:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)


    def partial_update(self, request, *args, **kwargs):
        query = models.User.objects.get(id=kwargs['pk'])
        if request.user.id != query.id:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


class Vehicle(viewsets.ModelViewSet):
    queryset = models.Vehicle.objects.all()
    serializer_class = VehicleSerializer

    def list(self, request, *args, **kwargs):
        queryset = models.Vehicle.objects.all().filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user'] = request.user
        if serializer.validated_data['is_electric'] == True and request.data['electric_info']['capacity'] != None and request.data['electric_info']['charge_port'] != None:
            electric_info_data = request.data.pop('electric_info')
            vehicle = models.Vehicle.objects.create(**serializer.validated_data)
            vehicle.save()
            electric_info_serializer = ElectricVehicleInfoSerializer(data=electric_info_data)
            electric_info_serializer.is_valid(raise_exception=True)
            electric_info_vehicle = models.ElectricVehicleInfo.objects.create(**electric_info_serializer.validated_data, vehicle=vehicle)
            electric_info_vehicle.save()
        else:
            if 'electric_info' in serializer.validated_data:
                serializer.validated_data.pop('electric_info')
            serializer.validated_data['is_electric'] = False
            self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        query = models.Vehicle.objects.get(id=kwargs['pk'])
        if query.user != request.user:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(query)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        query = models.Vehicle.objects.get(id=kwargs['pk'])
        serializer = self.serializer_class(query, data=request.data)
        serializer.is_valid(raise_exception=True)
        if query.user != request.user:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        if serializer.validated_data['is_electric'] == True and request.data['electric_info']['capacity'] != None and request.data['electric_info']['charge_port'] != None:
            if models.ElectricVehicleInfo.objects.filter(vehicle=query.id).exists():
                electric_info_data = request.data.pop('electric_info')
                electric_info = models.ElectricVehicleInfo.objects.get(vehicle=query.id)
                electric_info_serializer = ElectricVehicleInfoSerializer(electric_info, data=electric_info_data)
                electric_info_serializer.is_valid(raise_exception=True)
                self.perform_update(electric_info_serializer)
            else:
                electric_info_data = request.data.pop('electric_info')
                electric_info_data['vehicle'] = query.id
                electric_info_serializer = ElectricVehicleInfoSerializer(data=electric_info_data)
                electric_info_serializer.is_valid(raise_exception=True)
                electric_info_vehicle = models.ElectricVehicleInfo.objects.create(**electric_info_serializer.validated_data, vehicle=query)
                electric_info_vehicle.save()
        else:
            if models.ElectricVehicleInfo.objects.filter(vehicle=query.id).exists():
                electric_info = models.ElectricVehicleInfo.objects.get(vehicle=query.id)
                electric_info.delete()
                serializer.validated_data['is_electric'] = False
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

    def partial_update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def destroy(self, request, *args, **kwargs):
        query = models.Vehicle.objects.get(id=kwargs['pk'])
        if query.user != request.user:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        query.delete()
        return Response('Deleted',status=status.HTTP_200_OK)


class ElectricVehicleInfo(viewsets.ModelViewSet):
    queryset = models.ElectricVehicleInfo.objects.all()
    serializer_class = ElectricVehicleInfoSerializer

    def list(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def create(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def partial_update(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


    def destroy(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)



class ParkingHistory(viewsets.ModelViewSet):
    queryset = models.ParkingHistory.objects.all()
    serializer_class = ParkingHistorySerializer

    def list(self, request, *args, **kwargs):
        queryset = models.ParkingHistory.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return super().list(request, *args, **kwargs)


    def create(self, request, *args, **kwargs):
        all_vehicles = models.Vehicle.objects.filter(user=request.user)
        all_parking = models.ParkingHistory.objects.filter(vehicle__in=all_vehicles, is_parking=True)
        if all_parking.exists():
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicleOwner = models.Vehicle.objects.get(id=serializer.validated_data['vehicle'].id)
        if vehicleOwner.user != request.user:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        serializer.validated_data['is_parking'] = True
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        query = models.ParkingHistory.objects.get(id=kwargs['pk'])
        serializer = self.serializer_class(query)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        query = models.ParkingHistory.objects.get(id=kwargs['pk'])
        if query.is_parking == False or (query.end_time and query.end_time <= timezone.now()):
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(query, data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicleOwner = models.Vehicle.objects.get(id=serializer.validated_data['vehicle'].id)
        if vehicleOwner.user != request.user:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        query = models.ParkingHistory.objects.get(id=kwargs['pk'])
        if query.is_parking == False or (query.end_time and query.end_time <= timezone.now()):
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(query, data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicleOwner = models.Vehicle.objects.get(id=serializer.validated_data['vehicle'].id)
        if vehicleOwner.user != request.user:
            return Response('No',status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        query  = models.ParkingHistory.objects.get(id=kwargs['pk'])
        if request.user.role == 'manager' and query.is_parking == False:
            query.delete()
            return Response('Deleted',status=status.HTTP_200_OK)
        return Response('No',status=status.HTTP_403_FORBIDDEN)  