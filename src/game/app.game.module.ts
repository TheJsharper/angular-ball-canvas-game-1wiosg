import { GameService } from './services/game.service';
import { AppGameViewComponent } from './views/app.game.view.component';
import { NgModule } from "@angular/core";




@NgModule({
    declarations:[AppGameViewComponent],
    imports:[],
    exports:[AppGameViewComponent],
    providers:[ {
        provide: GameService,
        useFactory: () => {
          const canvas: HTMLCanvasElement = document.createElement("canvas");
          console.log("--->", canvas)
          const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
          return new GameService(canvas, ctx);
        }
      }]
})
export class AppGameModule{

}