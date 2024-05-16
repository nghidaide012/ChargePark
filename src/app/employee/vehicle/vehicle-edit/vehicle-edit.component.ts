import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicle-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatSelectModule],
  templateUrl: './vehicle-edit.component.html',
  styleUrl: './vehicle-edit.component.css'
})
export class VehicleEditComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  ChargingTypes: any[] = [];
  subscriptionList: Subscription[] = [];
  submittedVehicle?: any;
  @Input()
  item?: any;

  @Output()
  toggleEdit = new EventEmitter<boolean>();



  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    console.log(this.item)
    this.subscriptionList.push(this.http.get('https://ig.example.be:8444/api/chargestation/', {
      withCredentials: true,
    }).subscribe((data:any) => {
      this.ChargingTypes = data.map((station: any) => {
        return {
          ...station,
          type_image: `${station.type_image.replace('http://app.example.be:8000', 'https://ig.example.be:8444')}`
        }
      });
      console.log(this.ChargingTypes)

    }))
    this.myForm = this.fb.group({
      plate: [this.item?.plate_number, {validators: [Validators.required, this.whitespaceValidator]}],
      is_electric: [this.item?.is_electric ? true : false],
      capacity: [this.item?.electric_info?.capacity],
      type: [this.item?.electric_info?.charge_port],
    });
    const isElectricControl = this.myForm.get('is_electric');
    const typeControl = this.myForm.get('type');
    const capacityControl = this.myForm.get('capacity');

    if (isElectricControl && typeControl && capacityControl) {
      isElectricControl.valueChanges.subscribe(value => {
        if (value) {
          typeControl.setValidators([Validators.required]);
          capacityControl.setValidators([Validators.required]);
        } else {
          typeControl.clearValidators();
          capacityControl.clearValidators();
        }
        typeControl.updateValueAndValidity();
        capacityControl.updateValueAndValidity();
      });
    }
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
        this.myForm.value.plate = this.myForm.value.plate.trim();
        const data = {
          plate_number: this.myForm.value.plate,
          is_electric: this.myForm.value.is_electric,
          electric_info: {
            capacity: this.myForm.value.is_electric ? this.myForm.value.capacity : null,
            charge_port: this.myForm.value.is_electric ? this.myForm.value.type : null
          }
        }


        if(this.item === null || this.item === undefined)
          {
            this.http.post('https://ig.example.be:8444/api/vehicle/', data, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
            .toPromise()
            .then((data) => {
              console.log(data);
              this.myForm.reset();
              this.toggleEdit.emit();
              location.reload();
            })
          }
        else
        {
          this.http.put('https://ig.example.be:8444/api/vehicle/'+this.item.id+'/', data, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
          .toPromise()
          .then((data) => {
            console.log(data);
            this.myForm.reset();
            this.toggleEdit.emit();
            location.reload();
          })
        }
      }
  }
  onCancel() {
    this.myForm.reset();
    this.toggleEdit.emit();
  }
  onSelectionChange(event: any)
  {
    console.log(event.value)
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(sub => sub.unsubscribe());
  }
}
