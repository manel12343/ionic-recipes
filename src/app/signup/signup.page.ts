import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user = {
    username: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: 'male',
  };

  constructor(private storage: Storage, private toastController: ToastController) {
    this.initStorage();
  }

  async ngOnInit() {}

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

  async registerUser() {

    // ✅ Vérification des champs
    if (!this.user.username.trim() || !this.user.email.trim() || !this.user.password.trim()) {
      this.presentToast("❌ Veuillez remplir tous les champs");
      return;
    }

    // 🔥 Récupérer les utilisateurs déjà enregistrés
    let registeredUsers = (await this.storage.get('registeredUsers')) || [];

    // ✅ Vérifier si l'email existe déjà
    const emailExists = registeredUsers.some((u: any) => u.email === this.user.email);
    if (emailExists) {
      this.presentToast("❌ Cet email existe déjà !");
      return;
    }

    // Créer le nouvel utilisateur avec ID et liste de recettes vide
    const newUser = {
      id: Date.now(),           // ID unique
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      dateOfBirth: this.user.dateOfBirth,
      gender: this.user.gender,
      recipes: []               // liste de recettes vide
    };

    // Ajouter à la liste et sauvegarder
    registeredUsers.push(newUser);
    await this.storage.set('registeredUsers', registeredUsers);

    this.presentToast("✔ Inscription réussie !");

    // Réinitialiser le formulaire
    this.user = {
      username: '',
      email: '',
      password: '',
      dateOfBirth: '',
      gender: 'male',
    };
  }
}
