import {
  Injectable, NgModule,
  Renderer2,
  RendererFactory2
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppGameModule } from 'src/game/app.game.module';
import { AppComponent } from "./app.component";



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
  imports: [BrowserModule, FormsModule,AppGameModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    RendererHelper,
   
  ]
})
export class AppModule {
   private canvas:HTMLCanvasElement;
  constructor(private rendererHelper: RendererHelper) {
   
  }
}
