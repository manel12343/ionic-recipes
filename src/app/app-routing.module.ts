import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule) },


  { path: 'users',loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule) },

  {
    path: 'edit-user',
    loadChildren: () => import('./edit-user/edit-user.module').then( m => m.EditUserPageModule)
  },
 {
  path: 'recipes-list',
  loadChildren: () => import('./recipes-list/recipes-list.module').then(m => m.RecipesListPageModule)
},
{
  path: 'recipe-detail/:id',
  loadChildren: () => import('./recipe-detail/recipe-detail.module').then(m => m.RecipeDetailPageModule)
},
{
  path: 'create-recipe',
  loadChildren: () => import('./create-recipe/create-recipe.module').then(m => m.CreateRecipePageModule)
},
{
  path: 'create-recipe/:id',
  loadChildren: () => import('./create-recipe/create-recipe.module').then(m => m.CreateRecipePageModule)
}

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
