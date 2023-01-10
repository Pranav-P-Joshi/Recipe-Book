import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id!: number;
  editMode = false;
  recipeForm!: FormGroup;


  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) {

              }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.id = +params['id'];
        this.editMode = params['id'] != null;
         this.initForm();
      }
    );
  }


  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else{
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onAddIngrediants(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
      })
    )
  }

  onCancel(){
    this.router.navigate( ['../'], {relativeTo: this.route} );
  }

  onClear(i: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngrediants:any = new FormArray([]);

      if (this.editMode) {
        const recipe = this.recipeService.getRecipe(this.id);
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;

         if(recipe['ingredients']){
           for (let ingrediant of recipe.ingredients){

            recipeIngrediants.push(
             new FormGroup({
                'name': new FormControl(ingrediant.name, Validators.required),
                'amount': new FormControl(ingrediant.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            );
           }
         }
      }
      this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngrediants
      });

  }

}
