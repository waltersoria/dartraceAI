import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn:'root'})
export class ApiService {
 readonly baseUrl='/api/v1';
 constructor(private http:HttpClient){}
 getProjects(){return this.http.get(this.baseUrl+'/projects');}
 getSectors(id:string){return this.http.get(this.baseUrl+'/projects/'+encodeURIComponent(id)+'/sectors');}
 getRiskMap(id:string){return this.http.get(this.baseUrl+'/projects/'+encodeURIComponent(id)+'/risk-map');}
 getInspections(id:string){return this.http.get(this.baseUrl+'/projects/'+encodeURIComponent(id)+'/inspections');}
 getReports(id:string){return this.http.get(this.baseUrl+'/projects/'+encodeURIComponent(id)+'/reports');}
}
