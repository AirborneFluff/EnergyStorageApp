import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadDataPageComponent } from './pages/upload-data-page/upload-data-page.component';
import { TariffPageComponent } from './pages/tariff-page/tariff-page.component';
import {FormsModule} from "@angular/forms";
import { PriorityPageComponent } from './pages/priority-page/priority-page.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { DevPageComponent } from './pages/dev-page/dev-page.component';
import { InputPageComponent } from './pages/input-page/input-page.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    UploadDataPageComponent,
    TariffPageComponent,
    PriorityPageComponent,
    LoadingPageComponent,
    DevPageComponent,
    InputPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
