import { Component ,Input,OnInit} from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router,RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChatSevicesService } from '../../services/chat-sevices.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [RouterOutlet,MatSidenavModule,RouterModule,FormsModule,
    MatListModule,MatIconModule,MatButtonModule,CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {  
  @Input() chat: any;
  constructor(private router: Router,private http: HttpClient, private chatService: ChatSevicesService){ }
  isLoggedIn :boolean=false; 
  newchaticon :boolean=false;
  searchText: any = '';
  messages: Message[] = [];
  showgoogle:boolean=true;
  headicon:boolean=false;
  currentChat: any = {}; // Initialize your chat model
  chatsBackup: any[] = [];

  ///test
  chats: { id: number, title: any }[] = [];
  activeChatId: number | null = null;
  chatCounter: number = 0;
  /////

  ngOnInit(){
    this.isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
  }

  userlogin(){    
    this.router.navigateByUrl('/Login');
  }
  userlogout(){ 
   
    localStorage.removeItem('isAuthenticated');
    this.isLoggedIn =false;
    this.router.navigate(['/']);
  }

  // Function to start a new chat

  startNewChat() {

    this.chatCounter++;
    if( this.chatCounter<=5){
      const newChat = { id: this.chatCounter, title:this.chatCounter };

    this.chats.push(newChat);

    this.setActiveChat(newChat.id);
      
    }else{
      return;
    }
    

  }

  setActiveChat(chatId: number) {

    this.activeChatId = chatId;

  }

  createNewChat(){

   this.startNewChat();
    //biswaaaaaaa
      // Create a backup of the current chat
    //   this.chatService.addChat(this.currentChat);  
    //   // Reset the current chat for a new session
    //   this.currentChat = {};  
    //   // Get updated chat backups
    //   this.chatsBackup = this.chatService.getChatsBackup();

    // console.log(this.chatsBackup);
    this.newchaticon=true;
    this.searchText='';
    this.messages=[];
    this.router.navigate(['/dashboard']);   
  }

  manageDoc(){
    this.router.navigate(['/managedoc']); 
  }
  //input box  works from here
  startListening(){
  
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-IN'; // Set the language for recognition
    recognition.interimResults = false;
    recognition.onstart = () => {
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.searchText = transcript;
        console.log(this.searchText);
    };
    recognition.onerror = (event: any) => {

    };
    recognition.onend = () => {

    };
    recognition.start();
  }

  sendMessage() {
    this.showgoogle=false;
    let url='https://reqres.in/api/users';
    if(this.searchText!==''){
      this.headicon=true;
      this.http.post<any>(url, { text: this.searchText, sender: 'user' }).
      subscribe(response => {      
        this.messages.push(response);
        console.log(this.messages);
      });
    }else{
       //this.headicon=false;
      this.messages.push({ text: 'All Well ?', sender: 'bot'});
    }
   
    this.searchText = '';
    
  }


}
