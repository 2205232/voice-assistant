import { Routes } from '@angular/router';
import { ChatWindowComponent } from './Component/chat-window/chat-window.component';
import { UserLoginComponent } from './Component/user-login/user-login.component';
import { AudioToFaqComponent } from './Component/audio-to-faq/audio-to-faq.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HistoryComponent } from './Component/history/history.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard'  , component: ChatWindowComponent },
    { path: 'Login'      , component:UserLoginComponent},
    { path: 'managedoc'  , component:FileUploadComponent},
    { path: 'AudioToFaq' , component:AudioToFaqComponent},
    { path:'History'     , component:HistoryComponent},
];
