import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://datosabiertos-catastro-apis.buenosaires.gob.ar/buscar/?texto=sitios%20de%20interes';
  private direccion: any = {};


  constructor(private http: HttpClient) { }

  getInstanciasData() {
    return fetch(this.apiUrl)
      .then(response => response.json())
      .then(data => data.instancias);
  }

  getSitioData(id:string){
    const sitioUrl='https://datosabiertos-catastro-apis.buenosaires.gob.ar/getObjectContent?id='+id;
    return fetch(sitioUrl)
      .then(response => response.json())
      .then(data => data);;
  }

  setId(data :any): void {
    this.direccion = data;
  }

  getId(): any {
    return this.direccion;
  }


  getAltura(x:string,y:string){
    const geocodeAPI='https://datosabiertos-usig-apis.buenosaires.gob.ar/geocoder/2.2/reversegeocoding?x='+x+'&y='+y
    return fetch(geocodeAPI)
    .then(response => response.text())
    .then(data => data);

  }

  getLatLong(direccion:string){
    const osmAPI='https://nominatim.openstreetmap.org/search.php?street=$'+direccion+'&city=ciudad+autonoma+de+buenos+aires&country=argentina&format=jsonv2';
    return fetch(osmAPI)
    .then(response=> response.json())
    .then(data=>data);
  }

}
