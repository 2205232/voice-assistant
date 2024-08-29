import { Component, NgModule  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import {CommonModule, NgIf} from '@angular/common';



@Component({
  selector: 'app-manage-doc',
  standalone: true,
  imports: [MatIconModule,NgIf,CommonModule],
  templateUrl: './manage-doc.component.html',
  styleUrl: './manage-doc.component.scss'
  
})

export class ManageDocComponent {
  selectedFiles: { name: string} [] = [];
  file: {name: string} = {name: 'File Name'};

  onFileSelected(event: any): void {
    if (event.target.files) {
      for (let i =0; i < event.target.files.length; i++) {
        this.selectedFiles.push(event.target.files[i]);
        console.log (this.selectedFiles);
      }
    }
    }
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      return;
    }
    console.log('Uploading files:', this.onFileSelected);
    this.selectedFiles = [];

    }
  }