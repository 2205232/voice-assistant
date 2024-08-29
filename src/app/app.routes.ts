import { Routes } from '@angular/router';
import { ChatWindowComponent } from './Component/chat-window/chat-window.component';
import { UserLoginComponent } from './Component/user-login/user-login.component';
import { ManageDocComponent } from './Component/manage-doc/manage-doc.component';
import { AudioToFaqComponent } from './Component/audio-to-faq/audio-to-faq.component';


export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: ChatWindowComponent },
    { path: 'Login'    ,  component:UserLoginComponent},
    { path: 'managedoc'    ,  component:ManageDocComponent},
    { path: 'AudioToFaq'    ,  component:AudioToFaqComponent},
];
