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

  constructor(
    private router: Router,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.initStorage();
  }

  ngOnInit() {}

  async initStorage() {
    await this.storage.create();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  async loginUser() {
    const registeredUsers = (await this.storage.get('registeredUsers')) || [];

    // Trouver l'utilisateur correspondant
    const foundUser = registeredUsers.find(
      (u: any) => u.email === this.user.email && u.password === this.user.password
    );

    if (foundUser) {
      // Stocker l'utilisateur connecté pour récupérer ses recettes plus tard
      await this.storage.set('currentUser', foundUser);

      this.presentToast(`Bienvenue ${foundUser.username} !`);
      this.router.navigate(['/recipes-list']);
    } else {
      this.presentToast('Email ou mot de passe incorrect.');
    }
  }
}
