import { Component, Input, OnInit } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { RouterOutlet } from '@angular/router'; 
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatListModule } from '@angular/material/list'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 
import { ChatSevicesService } from '../../services/chat-sevices.service'; 
import { catchError } from 'rxjs/operators'; 
import { of } from 'rxjs'; 
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'; 
 
 
interface Message { 
  text: string; 
  sender: 'user' | 'bot'; 
} 
 
@Component({ 
  selector: 'app-chat-window',  
  standalone: true, 
  imports: [ 
    RouterOutlet, MatSidenavModule, RouterModule, FormsModule, 
    MatListModule, MatIconModule, MatButtonModule, CommonModule,NgxSkeletonLoaderModule, 
  ], 
  templateUrl: './chat-window.component.html', 
  styleUrls: ['./chat-window.component.scss'] 
}) 
 
export class ChatWindowComponent implements OnInit {   
 
  @Input() chat: any; 
  isLoading: boolean = false; 
  isLoggedIn: boolean = false;  
  newchaticon: boolean = false; 
  searchText: string = '';  // Input for the search box 
  messages: Message[] = []; 
  showgoogle: boolean = true; 
  headicon: boolean = false; 
  currentChat: any = {}; // Initialize your chat model 
  chatsBackup: { chatId: number, chatMessages: Message[] }[] = [];  // Stores all chats 
  activeChatId: number = 1;  // Tracks the active chat ID   
  chatCounter: number = 1;  // Keeps track of the number of chat tabs created 
  Chathistory:any[]=[]; 
  title :string='' 
  userId: string = 'user123'; // In a real app, you should dynamically set this 
  message: string = ''; 
  chatHistory: { message: string, timestamp: Date }[] = []; 
 
  constructor(private router: Router, private http: HttpClient, private chatService: ChatSevicesService) { } 
 
 
  ngOnInit() { 
    this.newchaticon=true; 
    this.chatsBackup.push({ chatId: this.chatCounter, chatMessages: [] }); 
    this.setActiveChat(1);  // Set the first chat as active on load 
    if (localStorage.getItem('isAuthenticated') === 'true'){ 
      this.isLoggedIn=true; 
    } 
   // this.isLoggedIn = localStorage.getItem('isAuthenticated') === 'true'; 
  } 
 
  userlogin() {   
    this.router.navigateByUrl('/Login'); 
  } 
 
  userlogout() {  
 
    localStorage.removeItem('isAuthenticated'); 
    this.isLoggedIn = false; 
    this.router.navigate(['/']); 
  } 
 
  createNewChat() {        
    this.chatCounter++;  // Increment the chat counter for a new chat    
    if (this.chatsBackup.length >= 5 || this.chatCounter>=6) { 
      alert("Limit is not more than 5 ");   
      return;
      
    }
   
    this.chatService.addChat(this.messages);     
    this.messages = []; 
    this.chatsBackup.push({ chatId: this.chatCounter, chatMessages: [] });  // Add new chat to the backup 
     this.setActiveChat(this.chatCounter);  // Set the new chat as active   
 
  } 
 
  setActiveChat(chatId: number) { 
    this.activeChatId = chatId; 
    const activeChat = this.chatsBackup.find(chat => chat.chatId === chatId);      
    if (activeChat) { 
      this.messages = activeChat.chatMessages;  // Load the messages for the selected chat 
      console.log(this.messages);
    } 
     
     
  } 
 
  manageDoc(){ 
 
    this.router.navigate(['/managedoc']);  
 
  } 
  showHistory(){ 
    this.router.navigate(['/History']);  
  } 
 
  AudiotoFAQ(){ 
    this.router.navigate(['/AudioToFaq']);  
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
    if (this.searchText.trim()) { 
      // Display the user's message 
      this.showgoogle=false; 
       this.headicon=true;       
      this.messages.push({ text: this.searchText, sender: 'user' }); 
     
      this.isLoading = true; 
      // Prepare the JSON payload for the API      
      const payload = { 
 
        prompt: "Find answer to the following query.Reject questions which are irrelevant.Do not add any disclaimer section in the response:", 
 
        text: this.searchText, 
 
        language: "hi-IN", 
 
        datastore: "ondc-bot-ds_1707487778718" 
 
      }; 
      // Call the API 
      let URL ='https://apps.gcpwkshpdev.com/chat/v2'; 
 
      this.http.post<any>(URL, payload).pipe( 
        catchError(error => { 
         //console.error('Error caught in catchError:', error); 
        //  this.messages.push({ text: 'Error in API call: ' + error.message, sender: 'bot' }); 
          return of(null);  // return a fallback observable if needed 
        }) 
      ).subscribe( 
        response => { 
          if (response && response.results && response.results.length > 0) {            
            const botResponse = response.results[0].part.text || 'No response from the bot'; 
            this.isLoading = false; 
            this.newchaticon = false; 
            this.messages.push({ text: botResponse, sender: 'bot' }); 
          } else { 
            this.isLoading = false; 
            this.newchaticon = false; 
            this.messages.push({ text: 'No response received.', sender: 'bot' }); 
          } 
        } 
      ); 
      console.log(this.chatsBackup);
      let chatidkey=this.chatsBackup.find(chat => chat.chatId === this.activeChatId);  

      if (chatidkey) { 
        let keymessages:any[]=[];
        keymessages = chatidkey.chatMessages;
        console.log(keymessages);
        const chatname=keymessages[0].text;
        if(chatname){
          this.title=chatname;
        }
        
        
      }
      console.log(this.title);
      
      
      this.Chathistory=this.messages; 
      if(this.Chathistory.length > 0){ 
        this.sendhistoryMessage(); 
      } 
      // Clear the search box 
      this.searchText = ''; 
      //this.title='';
    } 
 
  } 
 
  sendhistoryMessage(){ 
    this.chatService.saveChatHistory(this.userId, this.Chathistory).subscribe( 
      (response) => { 
        console.log('Message saved:', response); 
       // this.chatHistory.push({ message: this.message, timestamp: new Date() }); 
        //this.message = ''; // Clear the input after sending 
      }); 
  }   
 
}
