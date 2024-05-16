import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreeImportService } from '../../three-import.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SpotComponent } from '../../spot/spot.component';

@Component({
  selector: 'app-parkinglot-detail',
  standalone: true,
  imports: [CommonModule, SpotComponent],
  templateUrl: './parkinglot-detail.component.html',
  styleUrl: './parkinglot-detail.component.css'
})
export class ParkinglotDetailComponent implements OnInit, OnDestroy{

  isAdding: boolean = false;
  isEditing: boolean = false;
  isRemoving: boolean = false;

  subcriptionList: Subscription[] = [];

  parkingSpaceDetailCLicked: {clicked: boolean, id: string} = {clicked: false, id: ''};


  constructor(private route: ActivatedRoute, private threeService: ThreeImportService, private http: HttpClient)
  {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'])
      {
        this.getModel(params['id']);
      }
    })
  }
  getModel(id: string)
  {
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/admin/parkinglot/'+id+'/', {  withCredentials: true,}).subscribe((data) => {
      this.threeService.importModel(data);
    }))
    this.subcriptionList.push(this.threeService.clickSpace$.subscribe((data) => {
      this.parkingSpaceDetailCLicked = {clicked: data.toggle, id: data.id};
    }))
  }
  toggleCloseComponent()
  {
    this.parkingSpaceDetailCLicked = {clicked: false, id: ''};
  }
  toggleAddParkingSpace()
  {
    this.isAdding = !this.isAdding;
    this.threeService.AddParkingSpaceToggled();
  }
  toggleReverse()
  {
    this.threeService.reverseToggled();
  }
  toggleSave()
  {
    this.isAdding = !this.isAdding;
    this.threeService.saveAddParkingSpace();
    location.reload();
  }
  toggleCancel()
  {
    this.isAdding = !this.isAdding
    this.threeService.cancelAddParkingSpace();
  }
  toggleEdit()
  {
    this.isEditing = !this.isEditing;
    this.threeService.EditToggled();
  }
  toggleEditCancel()
  {
    this.isEditing = !this.isEditing;
    this.threeService.CancelEditParkingDetail();

  }
  toggleEditSave()
  {
    this.isEditing = !this.isEditing;
    this.threeService.SaveEditParkingDetail();
    location.reload();
  }

  toggleRemove()
  {
    this.isRemoving = !this.isRemoving;
    this.threeService.removeParkingSpaceToggled();
  }
  ngOnDestroy(): void {
    this.subcriptionList.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
