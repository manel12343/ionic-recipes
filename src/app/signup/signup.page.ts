import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(private storage: Storage, private toastController: ToastController) { 
    this.initStorage();
  }
  user = {
    username: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: 'male', // Default to Male
  };
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
  ngOnInit() {
  }
  async initStorage() {
    await this.storage.create();
  }
  registerUser() {
    // Save registration data in Ionic Storage
    // Save registration data in Ionic Storage
    this.storage.get('registeredUsers').then((data: any) => {
      let registeredUsers = data || [];
      registeredUsers.push(this.user);
      this.storage.set('registeredUsers', registeredUsers).then(() => {
        // User registration successful
        this.presentToast('Registration successful!');

        // Clear the form fields after registration
        this.user = {
          username: '',
          email: '',
          password: '',
          dateOfBirth: '',
          gender: 'male',
        };
      });
    });
  }
}
