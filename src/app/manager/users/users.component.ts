import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy{
  subcriptionList: Subscription[] = [];
  userList: any[] = [];

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/admin/user/', {
      withCredentials: true,
    }).subscribe((data:any) => {
      this.userList = data;
      console.log(this.userList)
    }))
  }
  isParking(vehicles: any[])
  {
    return vehicles.some((vehicle: any) => vehicle.is_parking === true);
  }
  ngOnDestroy(): void {
  }

}
