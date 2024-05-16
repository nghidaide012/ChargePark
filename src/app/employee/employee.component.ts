import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit, OnDestroy {
  isToggled = true;

  subcriptionList: Subscription[] = [];
  dashboardTitle = [
    {
      title: 'Parkinglots',
      path: '/'
    },
    {
      title: 'My Vehicles',
      path: '/vehicles'
    },
    {
      title: 'Profile',
      path: '/user'
    },
    {
      title: 'Log out',
      path: '/logout'
    }
  ]
  constructor(public router :Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.toggleAnimation();
    this.getUserRole();
  }

  getUserRole()
  {
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/userrole', {  withCredentials: true,}).subscribe((data: any) => {
      if(data.role === 'manager')
        {
            this.dashboardTitle.unshift({
            title: 'Admin Dashboard',
            path: '/admin'
            })
        }
    }))
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/user/', {  withCredentials: true,}).subscribe((data) => {
      console.log(data)
    }))

  }

  toggleAnimation() {
    this.isToggled = !this.isToggled;
    const div = document.querySelector('.navbar') as HTMLElement | null;
    if (div?.style.transform === 'translateX(-100%)') {
      div.style.transform = 'translateX(0)';
    } else {
      div!.style.transform = 'translateX(-100%)';
    }
  }
  ngOnDestroy(): void {
    this.subcriptionList.forEach(sub => sub.unsubscribe());
  }
}
