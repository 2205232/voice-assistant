import { Component ,OnInit} from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router,RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private router: Router,private http: HttpClient){ }
  isLoggedIn :boolean=false; 
  searchText: any = '';
  messages: Message[] = [];
  showgoogle:boolean=true;
  headicon:boolean=false;

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

  newChat(){
    window.open('/');    
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
