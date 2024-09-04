import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { TranslateModule, TranslateService} from '@ngx-translate/core';


export class AppComponent {
  constructor() {
    // this.translate.setDefaultLang('en');
  }
}

@Component({
  selector: 'app-manage-doc',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './manage-doc.component.html',
  styleUrl: './manage-doc.component.scss'

})

export class ManageDocComponent {
  [x: string]: any;
  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;

  constructor(private snackBar: MatSnackBar) { }

  // Handler for file input change
  onFileChange(event: any): void {
    const file = event.target.files[0] as File | null;
    this.uploadFile(file);
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFile(file);
  }

  // Prevent default dragover behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Method to handle file upload
  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB
      console.log('Uploading files:', this['onFileSelected']);
      this['selectedFiles'] = [];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string); // Set image preview URL
      };
      reader.readAsDataURL(file);

      this.uploadSuccess = true;
      this.uploadError = false;
      this.imageName.set(file.name); // Set image name
    } else {
      this.uploadSuccess = false;
      this.uploadError = true;
      this.snackBar.open('Only image files are supported!', 'Close', {
        duration: 3000,
        panelClass: 'error',
      });
    }
  }

  // Method to remove the uploaded image
  removeImage(): void {
    this.selectedFile = null;
    this.imageName.set('');
    this.fileSize.set(0);
    this.imagePreview.set('');
    this.uploadSuccess = false;
    this.uploadError = false;
    this.uploadProgress.set(0);
  }

  saveFile() {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = 'myfile.txt'; // the file name
    const myFileContent: string = 'I am a text file! 😂';
    dlink.href = 'data:text/plain;charset=utf-16,' + myFileContent;
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }
 
}


// ----
// selectedFiles: { name: string} [] = [];
// file: {name: string} = {name: 'File Name'};

// onFileSelected(event: any): void {
//   if (event.target.files) {
//     for (let i =0; i < event.target.files.length; i++) {
//       this.selectedFiles.push(event.target.files[i]);
//       console.log (this.selectedFiles);
//     }
//   }
//   }
// uploadFiles(): void {
//   if (this.selectedFiles.length === 0) {
//     return;
//   }
//   console.log('Uploading files:', this.onFileSelected);
//   this.selectedFiles = [];