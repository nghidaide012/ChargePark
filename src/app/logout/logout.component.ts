import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit{
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      window.location.replace('https://ig.example.be:8444/login/logout');
      setTimeout(() => {
        window.location.replace('https://ig.example.be:8444/');
      }, 500);
    }, 1000);
  }
}
