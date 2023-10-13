import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  instanciasData: any[] = []; 
  displayData: string | null = null;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getInstanciasData()
      .then(instancias => {
        this.instanciasData = instancias;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  onSitioClick(id:any): void{
    console.log(id);
    this.dataService.setId(id);
      
  }

}
