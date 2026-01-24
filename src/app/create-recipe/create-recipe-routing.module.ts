import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRecipePage } from './create-recipe.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRecipePage
  },
  {
    path: ':id',
    component: CreateRecipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRecipePageRoutingModule {}
