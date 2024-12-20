import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  HighBP: number,
  HighChol: number,
  CholCheck: number,
  BMI: number,
  Smoker: number,
  Stroke: number,
  HeartDiseaseorAttack: number,
  PhysActivity: number,
  Fruits: number,
  Veggies: number,
  HvyAlcoholConsump: number,
  AnyHealthcare: number,
  NoDocbcCost: number,
  GenHlth: number,
  MentHlth: number,
  PhysHlth: number,
  DiffWalk: number,
  Sex: number,
  Age: number,
  Education: number,
  Income: number
}

export interface PredictionResponse {
  classification: string;
  interpretation: string;
  prediction: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:8080/api/v1/predictions'; // Update with your API URL

  constructor(private http: HttpClient) {}

  predict(data: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.apiUrl, data);
  }
}
