import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage {
  @Input() userData: any; 
  @Input() index: any;
  constructor(private storage: Storage,private modalController: ModalController) {
    this.initStorage();
  }

  closeModal() {
    this.modalController.dismiss();
  }
  async initStorage() {
    await this.storage.create();
  }
  async saveChanges() {
    const data = await this.storage.get('registeredUsers');
    data[this.index] = this.userData;
    this.storage.set('registeredUsers',data);
    this.modalController.dismiss({
    
      role: 'edited',
      data: this.userData, 
    });
  }
}

