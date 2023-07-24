import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InputPageComponent} from "./pages/input-page/input-page.component";
import {ResultsPageComponent} from "./pages/results-page/results-page.component";

const routes: Routes = [
  { path: '', redirectTo: 'input', pathMatch: 'full' },
  { path: 'input', component: InputPageComponent },
  { path: 'results', component: ResultsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
