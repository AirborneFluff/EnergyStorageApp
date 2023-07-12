import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadDataPageComponent } from './pages/upload-data-page/upload-data-page.component';
import { TariffPageComponent } from './pages/tariff-page/tariff-page.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    UploadDataPageComponent,
    TariffPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
