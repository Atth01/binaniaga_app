import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, Platform} from '@ionic/angular';
//import {statusbar} from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [Storage],
})
export class AppComponent {
  constructor(
  private storage: Storage,

  private navctrl : NavController,
  private platfrom : Platform
  //private statusBar : statusBar
  
){
  this.initialiazeApp();
  }

  async initialiazeApp(){
     await this.storage.create();
     this.platfrom.ready().then(() =>{
      //this.statusBar.styleDefault();
     });
     this.storage.get('isLoggedIn').then((val) => {
      if (val=== null || val === undefined || val === ''){
        this.navctrl.navigateRoot('/login');

      }else {
        this.navctrl.navigateRoot('/tabs/tab1');
      }
     });
  }
    
  }

