from django.shortcuts import render
from django.http import HttpResponse

from .serializers import ParkingLotSerializer, ChargeStationSerializer, SpotSerializer, UserSerializer, VehicleSerializer, ElectricVehicleInfoSerializer, ParkingHistorySerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from . import models


class ParkinglotManager(viewsets.ModelViewSet):
    queryset = models.ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset, many=True)
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
        serializer = self.serializer_class(queryset, many=True)
        for data in serializer.data:
            data.pop('parking_spaces')
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
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return Response('No',status=status.HTTP_403_FORBIDDEN)


class Vehicle(viewsets.ModelViewSet):
    queryset = models.Vehicle.objects.all()
    serializer_class = VehicleSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        if models.ElectricVehicleInfo.objects.filter(id=serializer.data['electric_info']).exists():
            serializer.data['is_electric'] = True
        else:
            serializer.data['electric_info'] = None
            serializer.data['is_electric'] = False
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.data['is_electric']:
            if not models.ElectricVehicleInfo.objects.filter(id=serializer.data['electric_info']).exists():
                serializer.data['electric_info'] = None
                serializer.data['is_electric'] = False
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ElectricVehicleInfo(viewsets.ModelViewSet):
    queryset = models.ElectricVehicleInfo.objects.all()
    serializer_class = ElectricVehicleInfoSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        update_vehicle = models.Vehicle.objects.get(id=serializer.data['vehicle'])
        update_vehicle.is_electric = True
        update_vehicle.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ParkingHistory(viewsets.ModelViewSet):
    queryset = models.ParkingHistory.objects.all()
    serializer_class = ParkingHistorySerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)    