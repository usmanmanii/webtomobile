import { Platform, AlertController } from '@ionic/angular';
import { ChangeDetectorRef, Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isShow = false;
  options: InAppBrowserOptions;
  disconnectSubscription: any;
  connectSubscription: any;
  constructor(
    private iab: InAppBrowser,
    private network: Network,
    private cd: ChangeDetectorRef,
    public alertController: AlertController, 
    public platform: Platform
  ) {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('not wifi connection, woohoo!');
      this.networkError();
          this.isShow = false;
    });
    
    // stop disconnect watch
    
    
    
    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi' || this.network.type !== null) {
          console.log('we got a wifi connection, woohoo!');
          this.isShow = true;

        }
      }, 3000);
    });
    
    // stop connect watch
   
    setTimeout(() => {
      this.checkNetwork();
      this.cd.detectChanges();
    }, 6000);


    window.addEventListener('touchstart', ()=>{});
    // this.iab.create(`https://app.jeatty.com`, `_blank`);
    // this.options = {
    //   hidenavigationbuttons:"yes",toolbarcolor:"#ffffff",
    //   zoom:"no",hideurlbar:"yes",presentationstyle:"fullscreen",toolbar:"no",hardwareback:"no",toolbarposition:"top",
    //   location:"no"
    // };
    // if(this.platform.is("ios")){
    //   this.options.location="no";
    // }
    // window.open(this.payData.payment_url, "_system", "location=yes");
    // const browser = this.iab.create("https://app.jeatty.com", "_self",this.options);

    // const browser = this.iab.create("http://healthchoice-uae.com/health-choice", "_self",this.options);
    // browser.show();

    //   // browser.on('loadstart').subscribe(event => {
    //     // this.events.publish('cartCount', {count:0 });
    //     // this.navCntrl.navigateBack(['/home']);
    //     // this.isShow = true;
    //     // this.cd.detectChanges();
    // // });

  }
  async networkError() {
    const alert1 = await this.alertController.create({
      header: 'Network error',
      // subHeader: 'Oops! No Network.',
      message: ' Please connect to internet or try again later.',
      buttons: ['OK']
    });

    await alert1.present();
  }

  checkNetwork() {

    if (this.network.type !== null || !this.platform.is('cordova')) {
      this.isShow = true;
    } else {
      this.networkError();
          this.isShow = false;
      return false;
    }
  }

  ionViewWillLeave(){
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
      
  }
}
