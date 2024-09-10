import { Injectable } from '@angular/core';
import {HttpClient,HttpEvent,HttpParams,HttpResponse,HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable ,BehaviorSubject} from 'rxjs';
import {GoogleGenerativeAI} from '@google/generative-ai';
import { response } from 'express';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatSevicesService {
  private generrativeAI:GoogleGenerativeAI;
  private chatsBackup: any[] = [];
  chatsBackupHistory: any[] = [];
  chatCounter: number = 0;

  
  private uploadUrl = 'http://localhost:3000/';
  private fetchFilesUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { 
    //this.generrativeAI =new GoogleGenerativeAI(environment.API_KEY);
    this.generrativeAI =new GoogleGenerativeAI('AIzaSyCs7nq4rVZ9KNt1GbtH0da9KQvfVAMC-OI');    
  }

//  async generateTest(payload:any){
//   const model =this.generrativeAI.getGenerativeModel({model:'gemini-pro'});
//   const results =await model.generateContent(payload);
//   const response = await results.response;
//   const text =response.text();
//   console.log(text);

//  }

 getgenerateTest(payload:any){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  let headeroptions = { headers: headers };
  let URL ='https://apps.gcpwkshpdev.com/chat/v2';
  //let url='https://catfact.ninja/fact';
  return this.http.post<any>(URL,payload,headeroptions).pipe(map(response=>response))
  //return this.http.get<any>(url,payload).pipe(map(response=>response))

 }

  getChatsBackup() {
    return this.chatsBackup;
  }
  addChat(chat: any) {
    this.chatCounter++;   
    if (this.chatsBackup.length >= 5 || this.chatCounter>=6) {
      //this.chatsBackup.shift(); // Remove the oldest chat backup if limit is reached
      return;
    }
    this.chatsBackupHistory.push({chatId: this.chatCounter,chat});
    console.log(this.chatsBackupHistory);
    this.chatsBackup=this.chatsBackupHistory;

  }

  uploadFiles(files: File[]): Observable<any> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.http.post(this.uploadUrl, formData);
  }

  getFiles(): Observable<any> {
    return this.http.get(this.fetchFilesUrl);
  }
}
