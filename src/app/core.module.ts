import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { RecipeService } from "./recipes/recipe.service";
import { RecipeRecolverService } from "./recipes/recipes-resolver-service";
import { DataStorageService } from "./shared/data-storage.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

@NgModule({
  providers: [
    ShoppingListService, RecipeService, DataStorageService, RecipeRecolverService, AuthService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  },
  ]
})
export class CoreModule {}
