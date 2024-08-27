import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatSevicesService {
  private chatsBackup: any[] = [];

  constructor() { }

  getChatsBackup() {
    return this.chatsBackup;
  }

  addChat(chat: any) {
    if (this.chatsBackup.length >= 5) {
      this.chatsBackup.shift(); // Remove the oldest chat backup if limit is reached
    }
    this.chatsBackup.push(chat);
  }
}
