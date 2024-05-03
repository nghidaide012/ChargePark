import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ThreeImportService } from './three-import.service';

interface Parkinglot {
  id: string;
  company: string;
  address: string;
  available_space: number;
  icon: string;
  model_path: string;
  position: string;
  total_space: number;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {


  constructor() {
  }



}
