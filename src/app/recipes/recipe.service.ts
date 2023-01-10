import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RecipeService {

  constructor(private slService: ShoppingListService,
              private authService: AuthService) {}

  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Chow Mein',
  //     'A Super-Tasty Chow Mein - Just Awesome!',
  //     'https://www.chilitochoc.com/wp-content/uploads/2021/03/Desi-Chow-Mein-featured.jpg',
  //     [
  //       new Ingredient('Maggie', 4),
  //       new Ingredient('Veggie', 2)
  //     ]),
  //   new Recipe('Vada Pav',
  //     'What Else You Need To Say?',
  //     'https://www.cookwithmanali.com/wp-content/uploads/2018/04/Vada-Pav-500x500.jpg',
  //     [
  //       new Ingredient('Bread', 5),
  //       new Ingredient('Potato', 3),
  //       new Ingredient('Chili', 1)

  //     ])
  // ];


  get token(): string | null {
    throw new Error('Method not implemented.');
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    // localStorage.setItem('userRecipe', JSON.stringify(Recipe));
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newrecipe: Recipe){
    this.recipes[index] = newrecipe;
    this.recipeChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }


}
