import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-start',
  templateUrl: './recipe-start.component.html',
  styleUrls: ['./recipe-start.component.css']
})
export class RecipeStartComponent implements OnInit {

  id!: number;
  editMode = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    //    this.route.params.subscribe(
    //   (params: Params) =>{
    //     this.id = +params['id'];
    //     this.editMode = params['id'] != null;

    //   }
    // );
  }

}
