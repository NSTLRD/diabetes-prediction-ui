import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictionFormComponent } from './components/prediction-form/prediction-form.component';

const routes: Routes = [
  { path: '', component: PredictionFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
