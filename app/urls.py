from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings  
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'parkinglot', views.Parkinglot, basename='parkinglot')
router.register(r'chargestation', views.Chargestation, basename='chargestation')
router.register(r'spot', views.Spot, basename='spot')
router.register(r'user', views.User, basename='user')
router.register(r'vehicle', views.Vehicle, basename='vehicle')
router.register(r'electricvehicleinfo', views.ElectricVehicleInfo, basename='electricvehicleinfo')
router.register(r'parkinghistory', views.ParkingHistory, basename='parkinghistory')



manager_route = DefaultRouter()
manager_route.register(r'parkinglot', views.ParkinglotManager, basename='parkinglotmanager')
manager_route.register(r'spot', views.SpotManager, basename='spotmanager')
manager_route.register(r'chargestation', views.ChargestationManager, basename='chargestationmanager')
manager_route.register(r'user', views.UserManager, basename='usermanager')



urlpatterns = [
    path('', include(router.urls)),
    path('admin/', include(manager_route.urls)),
    path('userrole', views.UserRole),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
