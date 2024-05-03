import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThreeImportService } from '../../three-import.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parkinglot',
  standalone: true,
  imports: [],
  templateUrl: './parkinglot.component.html',
  styleUrl: './parkinglot.component.css'
})
export class ParkinglotComponent implements OnInit, OnDestroy{

  testing: any = [];
  subscriptionList: Subscription[] = [];

  constructor(private http: HttpClient, private threeImportService: ThreeImportService) {
  }
  ngOnInit(): void {
    this.subscriptionList.push(this.http.get('https://ig.example.be:8444/api/parkinglot/', {
      withCredentials: true,
    }).subscribe((data) => {
      this.testing = data;
      console.log(this.testing)
      this.threeImportService.importModel(this.testing);
    }))
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(sub => sub.unsubscribe());
  }

}
