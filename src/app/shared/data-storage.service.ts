import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable()
export class DataStorageService{

  constructor( private http: HttpClient,
               private recipeService: RecipeService){}

  storeRecipe() {
    const recipes = this.recipeService.getRecipes();
    this.http

    .put('https://ng-recipe-book-f93ba-default-rtdb.firebaseio.com/recipes.json',recipes)

     .subscribe(Response => {
         console.log( Response );
    });
  }

  fetchRecipe(){
      return this.http.get<Recipe[]>
        ('https://ng-recipe-book-f93ba-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map(recipes => {
              return recipes.map(recipe => {
                return {...recipe, ingrediants: recipe.ingredients ? recipe.ingredients : []
                };
              });
            }), tap(recipes => {
              this.recipeService.setRecipes(recipes);
            })
        );

  }

}
