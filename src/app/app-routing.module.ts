import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './containers/three/stage.component';

const routes: Routes = [
  { path: 'three', component: StageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'three' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
