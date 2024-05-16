import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThreeEmployeeService } from '../../three-employee.service';
import { HttpClient } from '@angular/common/http';
import { SpotComponent } from '../../spot/spot.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parkinglot-detail',
  standalone: true,
  imports: [SpotComponent, CommonModule],
  templateUrl: './parkinglot-detail.component.html',
  styleUrl: './parkinglot-detail.component.css'
})
export class ParkinglotDetailComponent implements OnInit, OnDestroy{


    subcriptionList: Subscription[] = [];

    parkingSpaceDetailCLicked: {clicked: boolean, id: string} = {clicked: false, id: ''};

    constructor(private route: ActivatedRoute, private threeService: ThreeEmployeeService, private http: HttpClient){}

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        if(params['id'])
        {
          this.getModel(params['id']);
        }
      })
    }

    getModel(id:string)
    {
      this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/parkinglot/'+id+'/', {  withCredentials: true,}).subscribe((data) => {
        console.log(data)
        this.threeService.importModel(data);
      }))
      this.subcriptionList.push(this.threeService.clickSpace$.subscribe((data) => {
        console.log(data)
        this.parkingSpaceDetailCLicked = {clicked: data.toggle, id: data.id};
      }))
    }
    toggleCloseComponent()
    {
      this.parkingSpaceDetailCLicked = {clicked: false, id: ''};
    }
    ngOnDestroy(): void {
     this.subcriptionList.forEach(sub => sub.unsubscribe());
    }

}
