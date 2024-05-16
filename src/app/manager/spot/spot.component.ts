import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatFormField } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ThreeImportService } from '../three-import.service';

@Component({
  selector: 'app-spot',
  standalone: true,
  imports: [CommonModule, MatFormField, MatSelectModule],
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
  chargeStationList: any[] = [];
  assignToggle: boolean = false;
  chargeStationAssigned?: any;
  currentParkingVehicle?: any;
  parkingHistoryList: any[] = [];


  constructor(private http: HttpClient, private threeService: ThreeImportService) { }
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
    this.subcription.push(this.http.get('https://ig.example.be:8444/api/admin/spot/'+this.item!.id+'/', {  withCredentials: true,}).subscribe((data) => {
      console.log(data);
      this.parkingSpaceDetail = data;
      this.parkingHistoryList = this.parkingSpaceDetail.parking_history.filter((item:any) => item.is_parking !== true);
      this.parkingHistoryList = this.parkingHistoryList.sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime());
      console.log(this.parkingHistoryList);
      if(this.parkingSpaceDetail.is_parking === true)
        {
          this.subcription.push(this.http.get('https://ig.example.be:8444/api/parkinghistory/'+this.parkingSpaceDetail.parking_history.filter((item:any) => item.is_parking === true)[0].id+'/', {  withCredentials: true,}).subscribe((data:any) => {
            this.currentParkingVehicle = data.vehicle_info;

          }))
        }

      this.subcription.push(this.http.get('https://ig.example.be:8444/api/admin/chargestation/', {  withCredentials: true,}).subscribe((data) => {
        this.chargeStationList = (data as any[]).map((station: any) => {
          return {
            ...station,
            type_image: `${station.type_image.replace('http://app.example.be:8000', 'https://ig.example.be:8444')}`
          }
        });
      }))
      if(this.parkingSpaceDetail.ChargeStation)
        {
          this.subcription.push(this.http.get('https://ig.example.be:8444/api/admin/chargestation/'+this.parkingSpaceDetail.ChargeStation+'/', {  withCredentials: true,}).subscribe((data) => {
            this.chargeStationAssigned = data;
            this.chargeStationAssigned.type_image = `${this.chargeStationAssigned.type_image.replace('http://app.example.be:8000', 'https://ig.example.be:8444')}`
          }))
        }
        else
        {
          this.chargeStationAssigned = undefined;
        }
    }))
  }

  ngOnDestroy(): void {
    this.subcription.forEach(sub => sub.unsubscribe());
  }
  closeDetail()
  {
    this.toggleClose.emit();
  }
  toggleAssign()
  {
    this.assignToggle = !this.assignToggle;
  }
  onSelectionChange(event: any)
  {
    console.log(event.value);
    let data = {
      ChargeStation: event.value,
      is_charge: true
    }
    if(event.value === 'none')
      {
        data = {
          ChargeStation: null,
          is_charge: false
        }
      }
    this.http.patch('https://ig.example.be:8444/api/admin/spot/'+this.item?.id+'/', data, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data: any) => {
      console.log(data);
      this.threeService.detectSpaceChange(data!.id);
    })
    this.chargeStationAssigned = this.chargeStationList.find((station: any) => station.id === event.value);
    this.toggleAssign();
  }
}
