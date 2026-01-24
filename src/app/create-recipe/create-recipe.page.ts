import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

interface Recipe {
  id: string;
  title: string;
  shortDescription: string;
  image?: string;
  prepTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  notes?: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.page.html',
  styleUrls: ['./create-recipe.page.scss'],
})
export class CreateRecipePage implements OnInit {
  recipeForm!: FormGroup;
  isEditMode: boolean = false;
  recipeId: string = '';
  currentUserEmail: string = ''; // email utilisateur connecté

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.initStorage();
    this.initializeForm();
  }

  async ngOnInit() {
    // Récupérer l'email de l'utilisateur connecté depuis storage
    const currentUser = await this.storage.get('currentUser');
    if (currentUser) {
      this.currentUserEmail = currentUser.email;
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = params['id'];
        this.loadRecipeForEdit();
      }
    });
  }

  initializeForm() {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      shortDescription: ['', Validators.required],
      image: [''],
      prepTime: ['', [Validators.required, Validators.min(1)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([''], Validators.required),
      steps: this.fb.array([''], Validators.required),
      notes: ['']
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.recipeForm.get('steps') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control(''));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addStep() {
    this.steps.push(this.fb.control(''));
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  async initStorage() {
    await this.storage.create();
  }

  async loadRecipeForEdit() {
    const recipes: Recipe[] = (await this.storage.get('recipes')) || [];
    const recipe = recipes.find(r => r.id === this.recipeId && r.userEmail === this.currentUserEmail);

    if (recipe) {
      // Clear existing arrays
      while (this.ingredients.length) this.ingredients.removeAt(0);
      while (this.steps.length) this.steps.removeAt(0);

      // Populate form
      this.recipeForm.patchValue({
        title: recipe.title,
        shortDescription: recipe.shortDescription,
        image: recipe.image || '',
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        notes: recipe.notes || ''
      });

      recipe.ingredients.forEach(ing => this.ingredients.push(this.fb.control(ing)));
      recipe.steps.forEach(step => this.steps.push(this.fb.control(step)));
    }
  }

  async saveRecipe() {
    if (!this.recipeForm.valid) return;

    const recipes: Recipe[] = (await this.storage.get('recipes')) || [];
    const formValue = this.recipeForm.value;

    const recipeData: Recipe = {
      ...formValue,
      ingredients: formValue.ingredients.filter((ing: string) => ing.trim() !== ''),
      steps: formValue.steps.filter((step: string) => step.trim() !== ''),
      id: this.isEditMode ? this.recipeId : this.generateId(),
      userEmail: this.currentUserEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isEditMode) {
      const index = recipes.findIndex(r => r.id === this.recipeId && r.userEmail === this.currentUserEmail);
      if (index !== -1) recipes[index] = recipeData;
    } else {
      recipes.push(recipeData);
    }

    await this.storage.set('recipes', recipes);

    const toast = await this.toastController.create({
      message: this.isEditMode ? 'Recipe updated successfully!' : 'Recipe created successfully!',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();

    this.navCtrl.navigateBack('/recipes-list');
  }

  async deleteRecipe() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Delete',
          handler: async () => {
            const recipes: Recipe[] = (await this.storage.get('recipes')) || [];
            const filteredRecipes = recipes.filter(r => !(r.id === this.recipeId && r.userEmail === this.currentUserEmail));
            await this.storage.set('recipes', filteredRecipes);

            const toast = await this.toastController.create({
              message: 'Recipe deleted successfully!',
              duration: 2000,
              position: 'bottom'
            });
            await toast.present();

            this.navCtrl.navigateBack('/recipes-list');
          }
        }
      ]
    });

    await alert.present();
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
