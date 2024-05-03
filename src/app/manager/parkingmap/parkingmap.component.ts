import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThreeImportService } from '../../three-import.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parkingmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parkingmap.component.html',
  styleUrl: './parkingmap.component.css'
})
export class ParkingmapComponent implements OnInit, OnDestroy {

  testing: any = [];
  editToggle: boolean = false;
  subcriptionList: Subscription[] = [];


  constructor(private http: HttpClient, private threeImportService: ThreeImportService) {
  }
  ngOnInit(): void {
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/parkinglot/', {
      withCredentials: true,
    }).subscribe((data) => {
      this.testing = data;
      console.log(this.testing)
      this.threeImportService.importModel(this.testing);
    }))
  }

  toggleEdit()
  {
    this.threeImportService.EditToggled();
    this.editToggle = !this.editToggle;
  }

  toggleCancel()
  {
    this.threeImportService.CancelToggled();
    this.editToggle = !this.editToggle;
  }

  toggleSave()
  {
    this.threeImportService.SaveToggled();
    this.editToggle = !this.editToggle;
    location.reload();
  }
  ngOnDestroy(): void {
    this.subcriptionList.forEach(sub => sub.unsubscribe());
  }
}
