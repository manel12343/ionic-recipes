import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {

  recipeId: string = '';
  recipe: any = null;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    this.storage.create();
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.recipeId = params['id'];
      await this.loadRecipe();
    });
  }

  async loadRecipe() {
    const recipes = await this.storage.get('recipes') || [];
    this.recipe = recipes.find((r: any) => r.id === this.recipeId);

    if (!this.recipe) {
      this.navCtrl.navigateBack('/recipes-list');
    }
  }

  editRecipe() {
    this.navCtrl.navigateForward(`/create-recipe/${this.recipeId}`);
  }
}
