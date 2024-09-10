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
  selectedFiles: never[] | undefined;
  selFiles: FileList | null | undefined;
  filesToUpload: File[] = [];
  uploadedFiles: any[] = [];
  
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
    this.filesToUpload = Array.from(event.target.files);
    //this.filesToUpload = Array.from();
      // this.selectedFiles = [];   
      // const element = event.currentTarget as HTMLInputElement;
      // this.selFiles = element.files;
   
      // let fileList: FileList | null = element.files;
      // if (fileList) {
      //   for (let itm in fileList)
      //   {
      //     let item: File = fileList[itm];
      //     if ((itm.match(/\d+/g) != null) && (!this.selectedFiles))
      //         this.selectedFiles; 
      //   }
      // }
  }  

  upload(){
    if (this.filesToUpload.length > 0) {
      this.uploadService.uploadFiles(this.filesToUpload).subscribe(
        (response:any) => {
        this.fetchFiles();
      },
      (error: any) => {
        console.error('Upload failed:', error);
      }
    );
    }   
    // if (this.currentFile) {
    //   this.uploadService.uploadFiles(this.currentFile).subscribe({
    //     next: (event: any) => {
    //       if (event.type === HttpEventType.UploadProgress) {
    //         this.progress = Math.round(100 * event.loaded / event.total);
    //       } else if (event instanceof HttpResponse) {
    //         this.message = event.body.message;
    //         this.fileInfos = this.uploadService.getFiles();
    //       }
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //       this.progress = 0;

    //       if (err.error && err.error.message) {
    //         this.message = err.error.message;
    //       } else {
    //         this.message = 'Could not upload the file!';
    //       }
    //     },
    //     complete: () => {
    //       this.currentFile = undefined;
    //     }
    //   });
    // }

  }

  fetchFiles() {
    this.uploadService.getFiles().subscribe((files) => {
      this.uploadedFiles = files;
      this.totalRecords  = this.uploadedFiles.length;
      //this.uploadedFiles.paginator = this.paginator;
      console.log(this.uploadedFiles);
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