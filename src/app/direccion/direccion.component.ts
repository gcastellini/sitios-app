import { Component } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent {

  direccionData: any[] = []; 
  sitio:string | null | undefined;
  centroide: string[] = [];
  altura!:string;
  lat!:number;
  long!:number;
  error: string | null = null;

  map!: L.Map;

  initMap(): void {
    this.map = L.map('leafletMap').setView([this.lat, this.long], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.marker([this.lat, this.long]).addTo(this.map);

  }


  extractAndStoreNumbers(responseString: string) {
    const numberPattern = '[-]{0,1}[\\d]*[\\.]{0,1}[\\d]+';
    const regex = new RegExp(numberPattern, 'g');
    const numbers = responseString.match(regex);

    if (numbers){
      this.centroide = numbers.map(String);
    }
    else{
      this.centroide=[];
    }
    
  }

  formatAltura(altura:string){
    const formattedPuerta=altura.split(', ')
    .map((part)=> part.replaceAll(/ /g,'+').replace(/PRES\.|TTE\.|ALTE\.|F\.|GRAL\./g,''))
    .join('+');


    return formattedPuerta;

  }

  constructor(private dataService: DataService){

  }

  ngOnInit(){
    this.dataService.getSitioData(this.dataService.getId())
      .then(data=>{
        this.direccionData=data;
        console.log(this.direccionData);
        this.sitio=data.contenido[0].valor;
        this.extractAndStoreNumbers(data.ubicacion.centroide);        
        this.dataService.getAltura(this.centroide[0],this.centroide[1]).
        then(data=>{
          if (JSON.parse(data.slice(1,-1)).puerta){
          this.altura=JSON.parse(data.slice(1,-1)).puerta;
          } else{
            this.altura=JSON.parse(data.slice(1,-1)).altura_par;
          }
          this.dataService.getLatLong(this.formatAltura(this.altura)).then
          (data=>{
            console.log(data);
            this.lat=data[0].lat;
            this.long=data[0].lon;
            this.initMap();
          }
            ).catch
            (error=>{
              console.error('Error fetching data:', error);
              this.error = 'Map not available';
            });
            
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.error = 'Map not available';
        })
      })
      
      .catch(error => {
        console.error('Error fetching data:', error);
        this.error = 'Map not available';
      });
      
    
      


  }

}