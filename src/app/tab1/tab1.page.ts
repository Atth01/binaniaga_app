import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  public User: any;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    this.getUser();
  }

  ionViewWillEnter(): void {
    try {
      this.getUser();
    } catch (e) {
      throw new Error(e + 'Method not implemented.');
    }
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

  async getUser() {
    await this.storage.create();
    this.storage.get('isLoggedIn').then(async (val) => {
      try {
        const res = await axios.get(
          'https://bimbingan.api.unbin.ac.id/index.php/api/getMahasiswa/' + val
        );
        let data = res.data[0];
        if (data.foto == val + '.jpg') {
          data.barcode = 
          'https://fkm.unbin.ac.id/WelcomeMahasiswa/qrcode/' + data.foto;
          data.foto =
            'https://akademik.unbin.ac.id/foto/mahasiswa/' + data.foto;
        } else {
          data.foto = 'https://akademik.unbin.ac.id/foto/mahasiswa/nofoto.jpg';
        }
        this.User = Array(data);
      } catch (err) {
        this.presentToast('Cannot get data !!!', 'danger');
      }
    });
  }

  async logout() {
    this.storage.remove('isLoggedIn');
    localStorage.removeItem('isLoggedIn');
    this.navCtrl.navigateRoot(['/login']);
  }

  async updateMhs() {
    this.navCtrl.navigateRoot('/update-mhs');
  }
}
