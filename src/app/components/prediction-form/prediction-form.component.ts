// prediction-form.component.ts
import { Component, OnInit } from '@angular/core';
import { PredictionService, PredictionRequest, PredictionResponse } from '../../services/prediction.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-prediction-form',
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PredictionFormComponent implements OnInit {
  today = new Date();
  showForm = false;
  showSuccess = false;
  radius = 120;
  circumference = 2 * Math.PI * this.radius;

  // Inicializar request con valores por defecto
  request: PredictionRequest = {
    HighBP: 0,
    HighChol: 1,
    CholCheck: 1,
    BMI: 35,
    Smoker: 1,
    Stroke: 1,
    HeartDiseaseorAttack: 1,
    PhysActivity: 0,
    Fruits: 0,
    Veggies: 0,
    HvyAlcoholConsump: 1,
    AnyHealthcare: 0,
    NoDocbcCost: 1,
    GenHlth: 5,
    MentHlth: 10,
    PhysHlth: 15,
    DiffWalk: 1,
    Sex: 0,
    Age: 60,
    Education: 1,
    Income: 2
  };

  // Datos de métricas que se actualizarán con los datos del formulario
  metrics = {
    eaten: {
      value: 0,
      total: 3000,
      unit: 'cal'
    },
    activity: {
      value: 0,
      unit: 'Steps'
    },
    water: {
      value: 0,
      unit: 'GL'
    },
    bloodGlucose: {
      value: 0,
      unit: 'mg/dl'
    },
    heart: {
      value: 0,
      unit: 'bpm'
    }
  };

  prediction: PredictionResponse = {
    prediction: 0,
    classification: '',
    interpretation: ''
  };

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    // Inicializar métricas con valores por defecto
    this.initializeMetrics();
  }

  initializeMetrics() {
    this.metrics.eaten.value = 70;
    this.metrics.activity.value = 2032;
    this.metrics.water.value = 4;
    this.metrics.bloodGlucose.value = 136;
    this.metrics.heart.value = 72;
  }

    // Helper para obtener las keys del request
    getFormKeys(): ReadonlyArray<keyof PredictionRequest> {
      return this.formKeys;
    }

  formKeys: ReadonlyArray<keyof PredictionRequest> = [
    'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke',
    'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies',
    'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'GenHlth',
    'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age', 'Education', 'Income'
  ];

  getRequestValue(key: keyof PredictionRequest): number {
    return this.request[key];
  }

  setRequestValue(key: keyof PredictionRequest, value: number): void {
    this.request[key] = value;
  }

  onSubmit() {
    // Verificar que todos los campos requeridos estén completos
    if (this.validateForm()) {
      console.log('Enviando datos al servidor:', {
        request: this.request,
        requestJSON: JSON.stringify(this.request, null, 2)
      });

      this.predictionService.predict(this.request).subscribe(
        (response: PredictionResponse) => {
          console.log('Respuesta del servidor:', {
            response: response,
            responseJSON: JSON.stringify(response, null, 2)
          });

          this.prediction = response;
          this.updateMetrics();
          this.showForm = false; // Ocultar el formulario después de enviar
        },
        error => {
          console.error('Error al realizar la predicción:', {
            error: error,
            errorJSON: JSON.stringify(error, null, 2)
          });
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      );
    } else {
      console.warn('Formulario inválido. Datos actuales:', {
        request: this.request,
        requestJSON: JSON.stringify(this.request, null, 2)
      });
    }
  }


  validateForm(): boolean {
    const requiredNonZeroFields: (keyof PredictionRequest)[] = ['Age', 'BMI'];

    for (const [key, value] of Object.entries(this.request)) {
      // Verificar si el valor está indefinido o es negativo
      if (value === undefined || value < 0) {
        return false;
      }

      // Verificar si los campos requeridos no son cero
      if (value === 0 && requiredNonZeroFields.includes(key as keyof PredictionRequest)) {
        return false;
      }
    }

    return true;
  }

  updateMetrics() {
    if (this.prediction) {
      // Actualizar métricas basadas en los datos del formulario y la predicción
      this.metrics.bloodGlucose.value = this.request.BMI > 25 ?
        Math.round(120 + this.request.BMI) :
        Math.round(90 + this.request.BMI);

      this.metrics.heart.value = this.request.PhysActivity === 1 ?
        Math.round(65 + Math.random() * 10) :
        Math.round(75 + Math.random() * 15);

      // Actualizar actividad basada en physActivity
      this.metrics.activity.value = this.request.PhysActivity === 1 ?
        Math.round(8000 + Math.random() * 2000) :
        Math.round(2000 + Math.random() * 1000);

      // Actualizar agua consumida
      this.metrics.water.value = this.request.PhysActivity === 1 ? 8 : 4;

      // Actualizar calorías consumidas
      this.metrics.eaten.value = Math.round(70 + (this.request.PhysActivity * 10));
    }
  }

  getPredictionScore(): number {
    if (this.prediction) {
      // Convertir la predicción a un score de 0-100
      return 100 - Math.round(this.prediction.prediction * 100);
    }
    return 80; // Valor por defecto
  }

  getDashOffset(): number {
    if (this.prediction) {
      const progress = 1 - this.prediction.prediction; // Invertir para que 0 sea malo y 1 sea bueno
      return this.circumference - (progress * this.circumference);
    }
    return this.circumference * 0.2; // Valor por defecto (80%)
  }

  getEatenProgress(): string {
    const total = this.metrics.eaten.total;
    const current = (this.metrics.eaten.value / 100) * total;
    const progress = (current / total) * 176; // 176 es la circunferencia del círculo
    return `${progress} 176`;
  }

  // Helper para mostrar etiquetas más amigables en el formulario
  getFieldLabel(key: keyof PredictionRequest): string {
    const labels: Record<keyof PredictionRequest, string> = {
      HighBP: 'High Blood Pressure',
      HighChol: 'High Cholesterol',
      CholCheck: 'Cholesterol Check',
      BMI: 'BMI',
      Smoker: 'Smoker',
      Stroke: 'Stroke History',
      HeartDiseaseorAttack: 'Heart Disease/Attack',
      PhysActivity: 'Physical Activity',
      Fruits: 'Fruits Consumption',
      Veggies: 'Vegetables Consumption',
      HvyAlcoholConsump: 'Heavy Alcohol Consumption',
      AnyHealthcare: 'Healthcare Coverage',
      NoDocbcCost: 'Doctor Visit Cost Issues',
      GenHlth: 'General Health',
      MentHlth: 'Mental Health',
      PhysHlth: 'Physical Health',
      DiffWalk: 'Difficulty Walking',
      Sex: 'Sex',
      Age: 'Age',
      Education: 'Education Level',
      Income: 'Income Level'
    };
    return labels[key] || key;
  }
}
