import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatFormField } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

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
  subcription: Subscription[] = [];
  parkingSpaceDetail?: any;
  chargeStationList: any[] = [];
  assignToggle: boolean = false;
  chargeStationAssigned?: any;


  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    if(this.item?.clicked)
      {
        this.subcription.push(this.http.get('https://ig.example.be:8444/api/admin/spot/'+this.item.id+'/', {  withCredentials: true,}).subscribe((data) => {
          console.log(data);
          this.parkingSpaceDetail = data;

          this.subcription.push(this.http.get('https://ig.example.be:8444/api/admin/chargestation/', {  withCredentials: true,}).subscribe((data) => {
            this.chargeStationList = (data as any[]).map((station: any) => {
              return {
                ...station,
                type_image: `${station.type_image.replace('http://app.example.be:8000', 'https://ig.example.be:8444')}`
              }
            });
            console.log(this.chargeStationList)
            this.chargeStationAssigned = this.chargeStationList.find((station: any) => station.id === this.parkingSpaceDetail?.ChargeStation);
            console.log(this.chargeStationAssigned);
          }))
        }))

      }
  }
  ngOnDestroy(): void {
    this.subcription.forEach(sub => sub.unsubscribe());
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
    this.http.patch('https://ig.example.be:8444/api/admin/spot/'+this.item?.id+'/', data, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
      console.log(data);
    })
    this.chargeStationAssigned = this.chargeStationList.find((station: any) => station.id === event.value);
    this.toggleAssign();
  }
}
