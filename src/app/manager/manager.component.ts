import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent implements OnInit{
  isToggled = true;
  dashboardTitle = [
    {
      title: 'Parkinglots',
      path: '/admin'
    },
    {
      title: 'Parking Map',
      path: '/admin/parkingmap'
    },
    {
      title: 'Charge Stations',
      path: '/admin/chargestation'
    },
    {
      title: 'Users',
      path: '/admin/users'
    },
    {
      title: 'Log out',
      path: '/logout'
    }
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.toggleAnimation();
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
}
