import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThreeEmployeeService } from '../three-employee.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-spot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatSelectModule,MatSnackBarModule],
  templateUrl: './spot.component.html',
  styleUrl: './spot.component.css'
})
export class SpotComponent implements OnInit, OnDestroy{

  @Input()
  item?: {clicked: boolean, id: string};
  @Output()
  toggleClose = new EventEmitter();
  subcription: Subscription[] = [];
  parkingSpaceDetail?: any;
  assignToggle: boolean = false;
  chargeStationAssigned?: any;

  vehicleList: any[] = [];

  currentParkingVehicle?: any;

  AssignPark: boolean = false;

  myForm!:FormGroup;

  isMyVehicle: boolean = false;


  constructor(private snackbar: MatSnackBar,private http: HttpClient, private threeService: ThreeEmployeeService, private fb: FormBuilder) { }
  ngOnInit(): void {

    if(this.item?.clicked)
      {

        this.getSpaceData();
      }
    this.subcription.push(this.threeService.clickedSpotUpdate$.subscribe((data) => {
      if(this.item?.id === data.id)
      {
        this.getSpaceData();
      }
    }))
  }

  getSpaceData()
  {
    this.subcription.push(this.http.get('https://ig.example.be:8444/api/vehicle/', {  withCredentials: true,}).subscribe((data:any) => {
      this.vehicleList = data;
    this.subcription.push(this.http.get('https://ig.example.be:8444/api/spot/'+this.item!.id+'/', {  withCredentials: true,}).subscribe((data) => {
      console.log(data);
      this.parkingSpaceDetail = data;
      if(this.parkingSpaceDetail.is_parking === true)
        {
          this.subcription.push(this.http.get('https://ig.example.be:8444/api/parkinghistory/'+this.parkingSpaceDetail.parking_history.filter((item:any) => item.is_parking === true)[0].id+'/', {  withCredentials: true,}).subscribe((data:any) => {
            this.currentParkingVehicle = data.vehicle_info;
            if(this.vehicleList.some((vehicle:any) => vehicle.id === this.currentParkingVehicle.id))
            {
              this.isMyVehicle = true;
            }
          }))
        }
      if(this.parkingSpaceDetail.ChargeStation)
      {
        this.subcription.push(this.http.get('https://ig.example.be:8444/api/chargestation/'+this.parkingSpaceDetail.ChargeStation+'/', {  withCredentials: true,}).subscribe((data) => {
          this.chargeStationAssigned = data;
          this.chargeStationAssigned.type_image = `${this.chargeStationAssigned.type_image.replace('http://app.example.be:8000', 'https://ig.example.be:8444')}`
        }))
      }
      else
      {
        this.chargeStationAssigned = undefined;
      }

    }))
  }))
  }

  toggleAssignPark()
  {
    this.AssignPark = true;
    if(this.parkingSpaceDetail && this.parkingSpaceDetail.is_parking === false)
      {
        this.myForm = this.fb.group({
          vehicle: [this.vehicleList[0], {validators: [Validators.required]}],
        });
      }
  }

  closeAssignPark()
  {
    this.AssignPark = false;
  }
  ngOnDestroy(): void {
    this.subcription.forEach(sub => sub.unsubscribe());
  }

  closeDetail()
  {
    this.toggleClose.emit();
  }

  onSubmit()
  {
    if(this.myForm.valid)
    {
      this.http.post('https://ig.example.be:8444/api/parkinghistory/', {vehicle: this.myForm.value.vehicle, parking_spot: this.item!.id }, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
        console.log(data);
        this.threeService.detectSpaceChange(this.item!.id)
        this.closeAssignPark();
      })
      .catch((error) => {
        console.log(error);
        this.snackbar.open('You already parked your vehicle in this parking lot', 'OK', { duration: 5000 });
      })
    }
  }
  toggleUnpark()
  {
    this.http.put('https://ig.example.be:8444/api/parkinghistory/'+this.parkingSpaceDetail.parking_history.filter((item:any) => item.is_parking === true)[0].id+'/', {is_parking: false, parking_spot: this.item!.id, vehicle: this.currentParkingVehicle.id }, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
      console.log(data);
      this.threeService.detectSpaceChange(this.item!.id)
    })
  }
}
