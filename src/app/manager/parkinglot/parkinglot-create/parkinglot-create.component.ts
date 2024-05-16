import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-parkinglot-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './parkinglot-create.component.html',
  styleUrl: './parkinglot-create.component.css'
})
export class ParkinglotCreateComponent implements OnInit {
  myForm!: FormGroup;
  selectedFile?: any;
  ImageFile?: File;
  modelFile?: File;
  @Input()
  item?: any;

  @Output()
  toggleCreate = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private http:HttpClient) { }

  ngOnInit(): void {
    console.log(this.item)
    this.myForm = this.fb.group({
      company: [this.item?.company, {validators: [Validators.required, this.whitespaceValidator]}],
      address: [this.item?.address, {validators: [Validators.required, this.whitespaceValidator]}],
      icon: [''],
      model_path: ['']
    });
    this.selectedFile = this.item?.icon;
  }
  whitespaceValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.trim().length === 0) {
      return { 'whitespace': true };
    }
    return null;
  }
  onImageSelect(event: any)
  {
    if(event.target.files && event.target.files[0])
      {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e) => {
          this.selectedFile = e.target?.result;
        }
        this.ImageFile = event.target.files[0];
      }
      else {
        this.selectedFile = undefined;
        this.ImageFile = undefined;
        console.log('No file selected');
      }
  }
  onModelSelect(event: any)
  {
    if(event.target.files && event.target.files[0])
      {
        this.modelFile = event.target.files[0];
        console.log(this.modelFile)
      }
    else
    {
      this.modelFile = undefined;
      console.log('No file selected');
    }
  }
  onSubmit() {
    if(this.myForm.valid)
      {
        this.myForm.value.company = this.myForm.value.company.trim();
        this.myForm.value.address = this.myForm.value.address.trim();
        if(this.item === null || this.item === undefined)
          {
            if(this.myForm.value.icon === '')
              {
                console.log('No image selected');
                return;
              }
            if(this.myForm.value.model_path === '')
              {
                console.log('No model_path selected');
                return;
              }
            const formData = new FormData();
            Object.keys(this.myForm.value).forEach(key => {
              if (key === 'icon') {
                formData.append(key, this.ImageFile!, this.ImageFile!.name);
              } else if (key === 'model_path') {
                formData.append(key, this.modelFile!, this.modelFile!.name);
              } else {
                formData.append(key, this.myForm.value[key]);
              }
            });
            this.http.post('https://ig.example.be:8444/api/admin/parkinglot/', formData,{withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
              console.log(data);
              this.myForm.reset();
              this.toggleCreate.emit();
            })
          }
        else
          {
            const formData = new FormData();
            Object.keys(this.myForm.value).forEach(key => {
              if (key === 'icon') {
                if(this.ImageFile !== undefined)
                  {
                    formData.append(key, this.ImageFile!, this.ImageFile!.name);
                  }
              } else if (key === 'model_path') {
                if(this.modelFile !== undefined)
                  {
                    formData.append(key, this.modelFile!, this.modelFile!.name);
                  }
              } else {
                formData.append(key, this.myForm.value[key]);
              }
            });
            this.http.patch('https://ig.example.be:8444/api/admin/parkinglot/'+this.item.id+'/', formData, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}}).toPromise().then((data) => {
              console.log(data);
              this.myForm.reset();
              this.toggleCreate.emit();
            })
          }

      }
  }
  onCancel()
  {
    this.myForm.reset();
    this.toggleCreate.emit();
  }
}
