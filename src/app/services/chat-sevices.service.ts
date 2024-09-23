import { Injectable } from '@angular/core';
import {HttpClient,HttpEvent,HttpParams,HttpResponse,HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable ,BehaviorSubject, of} from 'rxjs';
import {GoogleGenerativeAI} from '@google/generative-ai';
import { response } from 'express';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatSevicesService {
  private generrativeAI:GoogleGenerativeAI;
  private chatsBackup: any[] = [];
  chatsBackupHistory: any[] = [];

  private readonly URL = 'https://apps.gcpwkshpdev.com/chat/v2';
  private uploadUrl = 'http://localhost:3000/';
  private fetchFilesUrl = 'http://localhost:3000/saveChatHistory';
  private ChatHistoryUrl = 'http://localhost:3000/getChatHistory/';

  constructor(private http: HttpClient) { 
    //this.generrativeAI =new GoogleGenerativeAI(environment.API_KEY);
   // this.generrativeAI =new GoogleGenerativeAI('AIzaSyCs7nq4rVZ9KNt1GbtH0da9KQvfVAMC-OI');    
  }

//  async generateTest(payload:any){
//   const model =this.generrativeAI.getGenerativeModel({model:'gemini-pro'});
//   const results =await model.generateContent(payload);
//   const response = await results.response;
//   const text =response.text();
//   console.log(text);

//  }

sendChatRequest(payload: any): Observable<any> {
  return this.http.post<any>(this.URL, payload).pipe(
    catchError(error => {
      console.error('Error caught in ChatService:', error);
      return of({ error: 'Error in API call: ' + error.message });
       // Return fallback observable with error
    })
  );
}

  getChatsBackup() {
    return this.chatsBackup;
  }

  addChat(chat: any) {
    this.chatsBackupHistory.push({chat});
    this.chatsBackup=this.chatsBackupHistory;
    
  //  if(chatId=0){
  //   this.chatsBackupHistory.push({chatId: this.chatCounter,chat});
  //   this.chatsBackup=this.chatsBackupHistory;
  //  }else{
  //   console.log("test");
  //   //this.chatsBackup=this.chatsBackupHistory;
  //  }
   
  }

  uploadFiles(files: File[]): Observable<any>{
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.http.post(this.uploadUrl, formData);
  }

  getFiles(): Observable<any> {
    return this.http.get(this.uploadUrl);
  }

    // Save chat history to backend
    saveChatHistory(userId: string, message: any): Observable<any> {
      var messageJson = JSON.stringify(message);
      const payload = { userId, messageJson };
      return this.http.post(this.fetchFilesUrl, payload);
    }
  
    // // Fetch chat history from backend
    getChatHistory(userId: string): Observable<any> {
      const getdataURl=this.ChatHistoryUrl+userId;
      return this.http.get(getdataURl);
    }
  
}
