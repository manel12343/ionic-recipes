import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EditUserPage } from '../edit-user/edit-user.page';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
   index = 0;
  users: any[] = [];
  message = 'This modal example uses the modalController to present and dismiss modals.';
  constructor(private storage: Storage, public alertController: AlertController, private router : Router,private modalController: ModalController) {
    this.initStorage();
  }

  ngOnInit() {
    this.loadUsers();
  }
  async initStorage() {
    await this.storage.create();
  }
  async loadUsers() {
    const data = await this.storage.get('registeredUsers');
    if (data) {
      this.users = data;
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK'],
    });

    await alert.present();
  }
  closeModal() {
    this.modalController.dismiss();
  }
  async editUser(user: any) {
    this.index = this.users.indexOf(user);
    console.log(user);
    // Create a modal for editing the user
    const modal = await this.modalController.create({
      component: EditUserPage,
      componentProps: {
        userData: user,
        index : this.index,
      },
    });
  
    // Subscribe to the modal's result
    modal.onDidDismiss().then((result) => {
      if (result.role === 'edited') {
        // Handle the edited user data here
        const editedUserData = result.data;
        // Update the user data in your storage or data source
      }
    });
  
    // Present the modal
    return await modal.present();
  }
  async showDeleteConfirmation(user: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete ${user.username}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Deletion canceled');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteUser(user);
          },
        },
      ],
    });
  
    await alert.present();
  }
  deleteUser(user: any) {
    
    this.index = this.users.indexOf(user);
    if (this.index !== -1) {
      this.users.splice(this.index, 1);
      // Implement additional logic to remove the user from storage or a server here
      // For example, if you are using Ionic Storage, remove the user from storage
      // this.storage.remove('registeredUsers');
    }
    this.storage.set('registeredUsers', this.users)
  
    // Optionally, you can refresh the list of users
    // this.loadUsers();
  }
}
