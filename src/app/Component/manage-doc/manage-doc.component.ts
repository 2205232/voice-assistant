import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-doc',
  standalone: true,
  imports: [],
  templateUrl: './manage-doc.component.html',
  styleUrl: './manage-doc.component.scss'
})
export class ManageDocComponent {

  selectedFile: File | null = null;
  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0]
    }
  }
  onUpload() {
    if (this.selectedFile) {
      //console.error(this.selectedFile);
      const formData = new FormData();
      formData.append("file", this.selectedFile, this.selectedFile.name);

      // this.http.post('https://your-backend-url/upload', formData)
      
      // .subscribe({
      //   next:  (response: any)=> console.log('Upload Success',response),
      //   error:(err) => console.error('Upload failed',err),
      // });
    } else
    console.error('No file selected');
  }

}
