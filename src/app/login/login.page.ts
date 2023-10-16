import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: '',
    password: '',
  };
  ngOnInit() {
  }
  constructor(private router: Router,private storage:Storage, private toastController: ToastController) {
    this.initStorage();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  async loginUser() {
    const storedUserData = await this.storage.get('registeredUsers');
      
    if (storedUserData) {
      let loginSuccessful = false;
 
      storedUserData.forEach((registeredUser : any) => {
        if (registeredUser.email === this.user.email && registeredUser.password === this.user.password) {
          loginSuccessful = true;
        }
      });

      if (loginSuccessful) {
        this.router.navigate(['/dashboard']);
      } else {
        this.presentToast('Invalid email or password. Please try again.');
      }
    } else {
      this.presentToast('No registered users found. Please register before logging in.');
    }
  }
  async initStorage() {
    await this.storage.create();
  }
}
