import { Injectable } from '@angular/core';
import {HttpClient,HttpEvent,HttpParams,HttpResponse} from '@angular/common/http';
import { Observable ,BehaviorSubject} from 'rxjs';
import {GoogleGenerativeAI} from '@google/generative-ai';
import { response } from 'express';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatSevicesService {
  //private generrativeAI:GoogleGenerativeAI;
  private chatsBackup: any[] = [];
  chatsBackupHistory: any[] = [];
  chatCounter: number = 0;

  constructor(private http: HttpClient) { 

    //this.generrativeAI =new GoogleGenerativeAI(environment.API_KEY)
  }

//  async generateTest(payload:any){
//   const model =this.generrativeAI.getGenerativeModel({model:'gemini-pro'});
//   const results =await model.generateContent(payload);
//   const response = await results.response;
//   const text =response.text();
//   console.log(text);

//  }

 getgenerateTest(payload:any){
  let URL ='https://apps.gcpwkshpdev.com/chat/v2';
  return this.http.post<any>(URL,payload).pipe(map(response=>response))

  // const model =this.generrativeAI.getGenerativeModel({model:'gemini-pro'});
  // const results = model.generateContent(payload);
  // const response = await results.response;
  // const text =response.text();
  //console.log(text);

 }


  getChatsBackup() {
    return this.chatsBackup;
  }

  addChat(chat: any) {
    this.chatCounter++;   
    if (this.chatsBackup.length >= 5) {
      this.chatsBackup.shift(); // Remove the oldest chat backup if limit is reached
    }
    this.chatsBackupHistory.push({chatId: this.chatCounter,chat});
    console.log(this.chatsBackupHistory);
    this.chatsBackup=this.chatsBackupHistory;

  }
}
