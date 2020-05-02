export class Paddle {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public width: number,
    public thickness: number,
    public color: string
  ) {
    this.canvas.addEventListener("mousemove", (event: MouseEvent) =>
      this.updateMousePos(event)
    );
  }

  private updateMousePos(event: MouseEvent): void {
    const rect: ClientRect | DOMRect = this.canvas.getBoundingClientRect();
    const root: HTMLElement = document.documentElement;
    const mouseX: number = event.clientX - rect.left - root.scrollLeft;
    const mouseY: number = event.clientY - rect.top - root.scrollTop;
    this.x = mouseX - this.width / 2;
    this.y = mouseY;
   // console.log(this.y);
  }

  public draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y-20, this.width, this.thickness);
    console.log(this.x);
  }
}
