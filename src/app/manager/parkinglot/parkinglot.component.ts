import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThreeImportService } from '../three-import.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ParkinglotCreateComponent } from './parkinglot-create/parkinglot-create.component';

@Component({
  selector: 'app-parkinglot',
  standalone: true,
  imports: [CommonModule, RouterLink, ParkinglotCreateComponent],
  templateUrl: './parkinglot.component.html',
  styleUrl: './parkinglot.component.css'
})
export class ParkinglotComponent implements OnInit, OnDestroy{

  parkingLot: any = [];
  subcriptionList: Subscription[] = [];

  parkinglotEdit?: any;
  toggleCreate = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private threeImportService: ThreeImportService) {
  }
  ngOnInit(): void {
    const canvas  = document.querySelector('#canvas');
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/admin/parkinglot/', {
      withCredentials: true,
    }).subscribe((data) => {
      this.parkingLot = data;
      console.log(this.parkingLot)
    }))
  }

  ngOnDestroy(): void {
    this.subcriptionList.forEach(sub => sub.unsubscribe());
  }

  toggleCreateComponent()
  {
    this.parkinglotEdit = undefined;
    this.toggleCreate = !this.toggleCreate
  }
  onEdit(id:string)
  {
    this.toggleCreateComponent();
    this.parkinglotEdit = this.parkingLot.find((lot: any) => lot.id === id);
  }
  onRemove(id: string)
  {
    this.http.delete(`https://ig.example.be:8444/api/admin/parkinglot/${id}/`,{withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
      console.log(data);
      this.parkingLot = this.parkingLot.filter((lot: any) => lot.id !== id);
    })
  }
}
