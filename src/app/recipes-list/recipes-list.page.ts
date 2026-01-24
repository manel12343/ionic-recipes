import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.page.html',
  styleUrls: ['./recipes-list.page.scss'],
})
export class RecipesListPage implements OnInit {
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  searchTerm: string = '';
  currentUser: any = null;

  constructor(private storage: Storage, private router: Router) {
    this.initStorage();
  }

  async ngOnInit() {
    await this.loadCurrentUser();
    await this.loadRecipes();
  }

  async initStorage() {
    await this.storage.create();
  }

  // Charger l'utilisateur connecté
  async loadCurrentUser() {
    this.currentUser = await this.storage.get('currentUser');
    if (!this.currentUser) {
      // Si personne n'est connecté, retourner à la page login
      this.router.navigate(['/login']);
    }
  }

  // Charger les recettes de l'utilisateur connecté seulement
  async loadRecipes() {
    if (!this.currentUser) return;

    const allRecipes = (await this.storage.get('recipes')) || [];
    this.recipes = allRecipes.filter(
      (r: any) => r.userEmail === this.currentUser.email
    );
    this.filteredRecipes = [...this.recipes];
  }

  filterRecipes() {
    if (!this.searchTerm.trim()) {
      this.filteredRecipes = [...this.recipes];
      return;
    }

    this.filteredRecipes = this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      recipe.shortDescription.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      recipe.ingredients?.some((ing: string) =>
        ing.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  async ionViewWillEnter() {
    await this.loadCurrentUser();
    await this.loadRecipes();
  }
}
