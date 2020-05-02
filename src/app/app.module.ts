import {
  NgModule,
  Renderer2,
  RendererFactory2,
  Injectable
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { GameService } from "../game";

export const gameServiceFactory = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  return new GameService(canvas, ctx);
};

@Injectable()
export class RendererHelper {
  public renderer: Renderer2;
  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }
  public getCanvas(): HTMLCanvasElement {
    return this.renderer.createElement("canvas");
  }
}

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    RendererHelper,
    {
      provide: GameService,
      useFactory: () => {
     // const canvas: HTMLCanvasElement =   this.canvas;
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        console.log("--->", canvas)
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
       // console.log("factory",  this.testRenderInjectable.renderer.createElement("canvas"));
        return new GameService(canvas, ctx);
      }
    }
  ]
})
export class AppModule {
   private canvas:HTMLCanvasElement;
  constructor(private rendererHelper: RendererHelper) {
    /*this.canvas = 
      this.testRenderInjectable.renderer.createElement("canvas");
    console.log(
      "constructor--->",
      this.canvas
    );*/
  }
}
