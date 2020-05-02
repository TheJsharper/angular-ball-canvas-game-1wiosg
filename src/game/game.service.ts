

import { Brick, Field, Paddle } from './../models';
export class GameService {
  private timeoutRefs: any[] = [];
  private requestAninmationFrameRefs: number[] = [];
  private field: Field;

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D
  ) {
    this.canvas.width = 800;
    this.canvas.height = 700;
    this.field = new Field(this.canvas, this.ctx);
    this.field.draw();
  }
  public updateModels(): void {
    this.timeoutRefs.push(requestAnimationFrame(() => {
      this.timeoutRefs.push(setTimeout(() => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.field.grid = this.field.grid.map((value: boolean) => Math.random() > 0.5 ? true : false);
        this.field.draw();
        this.updateModels();
      }, 5000))

    }
    ));
  }
  public cleanUp(): void {
    this.requestAninmationFrameRefs.forEach((ref: number) => cancelAnimationFrame(ref));
    this.timeoutRefs.forEach((value) => clearTimeout(value));
  }
}
