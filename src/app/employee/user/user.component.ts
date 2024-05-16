import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy{
  subcriptionList: any[] = [];
  myForm!: FormGroup;
  userinfo!: any;
  constructor(private fb: FormBuilder, private http:HttpClient) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      role: [{value: '', disabled: true}],
      phone: ['', {validators: [Validators.required, Validators.pattern('^0[0-9]{9}$')]}],
    });
    this.subcriptionList.push(this.http.get('https://ig.example.be:8444/api/user/', {
      withCredentials: true,
    }).subscribe((data:any) => {
      this.userinfo = data;
      this.myForm.get('email')?.setValue(this.userinfo.email);
      this.myForm.get('role')?.setValue(this.userinfo.role);
      this.myForm.get('name')?.setValue(this.userinfo.first_name + " " + this.userinfo.last_name);
      this.myForm.get('phone')?.setValue(this.userinfo.phone);

    }));



  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.http.patch('https://ig.example.be:8444/api/user/'+this.userinfo.id+'/', {phone: this.myForm.value.phone}, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
      .toPromise()
      .then((data) => {
        console.log(data);
        this.myForm.reset();
        location.reload();
      })
    }
  }
  ngOnDestroy(): void {
    this.subcriptionList.forEach(sub => sub.unsubscribe());
  }
}
