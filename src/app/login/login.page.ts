import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private storage: Storage
  ) {}

  async alertToast(msg: any) {
    const toast = await this.alertCtrl.create({
      message: msg,
    });
    toast.present();
  }

  async presentToast(msg: any, color: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  async login() {
    if (this.username === '' || this.password === '') {
      this.presentToast('Username and password cannot be empty !', 'danger');
    } else {
      const loader = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loader.present();

      try {
        const storage = await this.storage.create();
        let url =
          'https://bimbingan.api.unbin.ac.id/index.php/api/login/' +
          this.username +
          '/' +
          this.password;
        const res = await axios.get(url);
        let data = res.data.result[0];
        let username = data.userid;
        let pass = data.pass_sha1;
        var password = CryptoJS.SHA1(this.password).toString();

        if (res.data.status == 'Ok') {
          if (data.aktif == '1') {
            if (username == this.username || pass == password) {
              loader.dismiss();
              storage.set('isLoggedIn', data.userid);
              localStorage.setItem('isLoggedIn', data.userid);
              this.navCtrl.navigateRoot(['/tabs/tab1']);
              this.presentToast('Login Success !', 'success');
            } else {
              loader.dismiss();
              this.presentToast(
                'Username or password is incorrect !!!',
                'danger'
              );
            }
          } else {
            loader.dismiss();
            this.presentToast('Account not found !!!', 'danger');
          }
        } else {
          loader.dismiss();
          this.presentToast('Account not active !!!', 'danger');
        }
      } catch (err) {
        loader.dismiss();
        this.alertToast('Account not found !!!');
      }
    }
  }

  register() {
    this.navCtrl.navigateForward('/register');
  }

  ngOnInit(): void {}
}
