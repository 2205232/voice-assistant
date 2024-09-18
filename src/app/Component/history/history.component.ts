import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChatSevicesService } from '../../services/chat-sevices.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,RouterModule,MatListModule,MatIconModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  chatHistory: any[] = [];
  userId: string = 'user123'; // Replace with dynamic user ID if needed

  constructor(private router: Router, private http: HttpClient, private chatService: ChatSevicesService) { }

  ngOnInit(): void {
    this.loadChatHistory();
  }


  toggleChatHistory(){

  }  

  loadChatHistory() {
    this.chatHistory = [
      { id: 1, title: 'Chat about Angular', date: new Date(2023, 5, 1), messages: [{"text":"hy","sender":"user"},{"text":"Error in API call: Http failure response for https://apps.gcpwkshpdev.com/chat/v2: 0 undefined","sender":"bot"},{"text":"No response received.","sender":"bot"},{"text":"test","sender":"user"}] },
      { id: 2, title: 'Discussion on TypeScript', date: new Date(2023, 5, 5), messages: [] },

    ];
    
  }

  // loadChatHistory(): void {
  //   this.chatService.getChatHistory(this.userId).subscribe((data) => {
  //     var messageJson = JSON.stringify(data);
  //     console.log( messageJson);
  //     this.chatHistory =data;
  //   });
  // }
}