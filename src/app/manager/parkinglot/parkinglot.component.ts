import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThreeImportService } from '../../three-import.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parkinglot',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './parkinglot.component.html',
  styleUrl: './parkinglot.component.css'
})
export class ParkinglotComponent implements OnInit, OnDestroy{

  parkingLot: any = [];
  subcriptionList: Subscription[] = [];


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

}
