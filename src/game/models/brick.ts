export class Brick {
  constructor(
    private ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string
  ) {
    this.color = color;
    //  this.draw(this.x, this.y, this.width, this.height, this.color);
  }

  public draw(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
