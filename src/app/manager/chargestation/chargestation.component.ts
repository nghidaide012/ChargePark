import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChargestationCreateComponent } from './chargestation-create/chargestation-create.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ThreeImportService } from '../three-import.service';

@Component({
  selector: 'app-chargestation',
  standalone: true,
  imports: [ChargestationCreateComponent, CommonModule],
  templateUrl: './chargestation.component.html',
  styleUrl: './chargestation.component.css'
})
export class ChargestationComponent implements OnInit, OnDestroy {
  toggleCreate = false;
  toggleDetail = false;
  chargeStations: any = [];
  subcriptionList: Subscription[] = [];
  chargeStationEdit?: any;

  toggleCreateComponent()
  {
    this.chargeStationEdit = undefined;
    this.toggleCreate = !this.toggleCreate;
  }




  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/admin/chargestation/', {
      withCredentials: true,
    }).subscribe((data) => {
      this.chargeStations = (data as any[]).map((station: any) => {
        return {
          ...station,
          type_image: `${station.type_image.replace('http://app.example.be:8000', 'https://ig.example.be:8444')}`
        }
      });
      console.log(this.chargeStations)
    }))
  }

  ngOnDestroy(): void {
    this.subcriptionList.forEach(sub => sub.unsubscribe());

  }

  onRemove(id: string)
  {
    this.http.delete(`https://ig.example.be:8444/api/admin/chargestation/${id}/`,{withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
      console.log(data);
      this.chargeStations = this.chargeStations.filter((station: any) => station.id !== id);
    })
  }
  onEdit(id: string)
  {
    this.toggleCreateComponent();
    this.chargeStationEdit = this.chargeStations.find((station: any) => station.id === id);
  }
}
