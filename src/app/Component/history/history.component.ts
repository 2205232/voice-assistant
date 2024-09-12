import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChatSevicesService } from '../../services/chat-sevices.service';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,RouterModule,],
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

  loadChatHistory(): void {
    // this.chatService.getChatHistory(this.userId).subscribe((data) => {
    //   this.chatHistory = data;
    // });
  }
}
