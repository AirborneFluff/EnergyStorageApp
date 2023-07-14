import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import {UploadDataPageComponent} from "./pages/upload-data-page/upload-data-page.component";
import {TariffPageComponent} from "./pages/tariff-page/tariff-page.component";
import {PriorityPageComponent} from "./pages/priority-page/priority-page.component";
import {LoadingPageComponent} from "./pages/loading-page/loading-page.component";

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomePageComponent, data: { animation: 'welcomePage' } },
  { path: 'upload', component: UploadDataPageComponent, data: { animation: 'uploadPage' } },
  { path: 'tariff', component: TariffPageComponent, data: { animation: 'tariffPage' } },
  { path: 'priority', component: PriorityPageComponent, data: { animation: 'priorityPage' } },
  { path: 'simulate', component: LoadingPageComponent, data: { animation: 'simulatePage' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
