import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chargestation-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chargestation-create.component.html',
  styleUrl: './chargestation-create.component.css'
})
export class ChargestationCreateComponent implements OnInit {
  myForm!: FormGroup;
  selectedFile?: any;
  ImageFile?: File;
  @Input()
  item?: any;



  @Output()
  toggleCreate = new EventEmitter<boolean>();


  constructor(private fb: FormBuilder, private http: HttpClient) {

  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      type: [this.item?.type, {validators: [Validators.required, this.whitespaceValidator]}],
      power: [this.item?.power, {validators: [Validators.required]}],
      type_image: ['']
    });
    this.selectedFile = this.item?.type_image;
  }
  whitespaceValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.trim().length === 0) {
      return { 'whitespace': true };
    }
    return null;
  }


  onSubmit() {
    if(this.myForm.valid)
      {
        this.myForm.value.type = this.myForm.value.type.trim();
        if(this.item === null || this.item === undefined)
          {
            if(this.myForm.value.type_image === '')
              {
                console.log('No image selected');
                return;
              }
            const formData = new FormData();
            Object.keys(this.myForm.value).forEach(key => {
              if (key === 'type_image') {
                formData.append(key, this.ImageFile!, this.ImageFile!.name);
              } else {
                formData.append(key, this.myForm.value[key]);
              }
            });
            console.log(formData);
            this.http.post('https://ig.example.be:8444/api/admin/chargestation/', formData, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
            .toPromise()
            .then((data) => {
              console.log(data);
              this.toggleCreate.emit();
              location.reload();
            })
            this.myForm.reset();
          }
          else
          {
            const formData = new FormData();
            Object.keys(this.myForm.value).forEach(key => {
              if (key === 'type_image') {
                if(this.ImageFile !== undefined)
                  {
                    formData.append(key, this.ImageFile!, this.ImageFile!.name);
                  }
              } else {
                formData.append(key, this.myForm.value[key]);
              }
            });

            this.http.patch(`https://ig.example.be:8444/api/admin/chargestation/${this.item.id}/`, formData, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
            .toPromise()
            .then((data) => {
              console.log(data);
              this.toggleCreate.emit();
              location.reload();
            })
            this.myForm.reset();

          }
      }
      else {
        console.log('Form is invalid')
      }
  }

  onFileSelected(event: any) {
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

  onCancel() {
    this.myForm.reset();
    this.toggleCreate.emit();
  }
}
