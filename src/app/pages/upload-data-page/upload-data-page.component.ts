import { Component } from '@angular/core';
import {SetupService} from "../../services/setup.service";

@Component({
  selector: 'app-upload-data-page',
  templateUrl: './upload-data-page.component.html',
  styleUrls: ['./upload-data-page.component.css']
})
export class UploadDataPageComponent {
  importUploaded = false;
  exportUploaded = false;

  constructor(private setup: SetupService) {}
  onImportFileSelected(event: any) {
    const file = event.target.files[0];
    this.setup.parseConsumptionFile(file).subscribe({
      next: val => {
        this.setup.importData = val;
        this.importUploaded = true;
        localStorage.setItem('importData', JSON.stringify(val));
      }
    })
  }

  onExportFileSelected(event: any) {
    const file = event.target.files[0];
    this.setup.parseConsumptionFile(file).subscribe({
      next: val => {
        this.setup.exportData = val;
        this.exportUploaded = true;
        localStorage.setItem('exportData', JSON.stringify(val));
      }
    })
  }

}
