import { Component, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ChatSevicesService } from '../services/chat-sevices.service'; 
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from '@angular/material/table' ;
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [MatToolbarModule,MatProgressBarModule,MatFormFieldModule,MatCardModule,
    MatListModule,CommonModule,MatInputModule,MatTableModule,MatIconModule,
    MatPaginatorModule,MatProgressSpinnerModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  currentFile?: File;
  progress = 0;
  message = '';
  totalRecords  = 0;
  pageSize = 10;
  pageIndex = 0;
  fileName = 'Select File';
  fileInfos?: Observable<any>;
  selectedFiles: any[]=[];
  selFiles: FileList | null | undefined;
  filesToUpload: File[] = [];
  uploadedFiles: any[] = [];

  chatHistory: any[] = [];
  userId: string = 'user123'; // Replace with dynamic user ID if needed

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private uploadService: ChatSevicesService) { }
  displayedColumns: string[] = ['name', 'url','Size','Type','Action'];

  ngOnInit() {
   this.fetchFiles();
  }

  // ngAfterViewInit() {
  //   this.uploadedFiles.paginator = this.paginator;
  // }

  fileSelectionChanged(event: any)  {
    this.selectedFiles = Array.from(event.target.files);
    
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.filesToUpload.push(this.selectedFiles[i]);
    }
  }

  // Removes a file from the selected list
  removeFile(index: number) {
    this.filesToUpload.splice(index, 1);
  }

  upload() {
    if (this.filesToUpload.length > 0) {
      this.uploadService.uploadFiles(this.filesToUpload).subscribe(
        (response) => {
          console.log(response);
        this.fetchFiles();
      },
      (error) => {
          console.error('Upload failed:', error);
        }
      );
    }   
   
  }

  fetchFiles() {
    this.uploadService.getFiles().subscribe((files) => {
      this.uploadedFiles = files;
      this.totalRecords  = this.uploadedFiles.length;
     // this.uploadedFiles.paginator = this.paginator;
      (error: any) => {
        console.error('Failed to fetch files:', error);
      }
    });
  }
 
  pageChangeEvent(event:any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchFiles();
}

 
}