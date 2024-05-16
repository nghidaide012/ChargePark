import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, VehicleEditComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent implements OnInit, OnDestroy{
  toggleCreate = false;
  toggleDetail = false;
  vehicles: any = [];
  subcriptionList: Subscription[] = [];
  vehicleEdit?: any;

  toggleCreateComponent()
  {
    this.vehicleEdit = undefined;
    this.toggleCreate = !this.toggleCreate;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/vehicle/', {  withCredentials: true,}).subscribe((data) => {
      console.log(data)
      this.vehicles = data;
    }))
  }

  ngOnDestroy() {
    this.subcriptionList.forEach(sub => sub.unsubscribe());
  }
  onEdit(id: string)
  {
    this.vehicleEdit = this.vehicles.find((vehicle: any) => vehicle.id === id);
    this.toggleCreate = true;
  }
  onRemove(id: string)
  {
    this.http.delete(`https://ig.example.be:8444/api/vehicle/${id}/`,{withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
      console.log(data);
      this.vehicles = this.vehicles.filter((vehicle: any) => vehicle.id !== id);
    })
  }

}
