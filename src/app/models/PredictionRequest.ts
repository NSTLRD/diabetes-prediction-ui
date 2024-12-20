export interface PredictionRequest {
  highBP: number;
  highChol: number;
  cholCheck: number;
  bmi: number;
  smoker: number;
  stroke: number;
  heartDiseaseorAttack: number;
  physActivity: number;
  fruits: number;
  veggies: number;
  hvyAlcoholConsump: number;
  anyHealthcare: number;
  noDocbcCost: number;
  genHlth: number;
  mentHlth: number;
  physHlth: number;
  diffWalk: number;
  sex: number;
  age: number;
  education: number;
  income: number;

  // Esto permite índices dinámicos con claves de tipo string
  [key: string]: number;
}
