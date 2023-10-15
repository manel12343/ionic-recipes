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
    // For demonstration purposes, let's hard-code valid credentials.
    const storedUserData = await this.storage.get('registeredUsers');
      
    if (storedUserData) {
      let loginSuccessful = false;
 
      storedUserData.forEach((registeredUser : any) => {
        if (registeredUser.email === this.user.email && registeredUser.password === this.user.password) {
          loginSuccessful = true;
        }
      });

      if (loginSuccessful) {
        // Successful login, navigate to another page (e.g., home page).
        this.router.navigate(['/dashboard']);
      } else {
        // Invalid credentials, show an error message.
        this.presentToast('Invalid email or password. Please try again.');
      }
    } else {
      // No registered users found, show an error message.
      this.presentToast('No registered users found. Please register before logging in.');
    }
  }
  async initStorage() {
    await this.storage.create();
  }
}
