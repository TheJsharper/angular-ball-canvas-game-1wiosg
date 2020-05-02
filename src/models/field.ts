import { Brick } from "./brick";
export class Field {
  private cols: number;
  private rows: number;
  public grid: boolean[];
  private width: number;
  private height: number;
  private gaps: number;
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.cols = 50;
    this.rows = 20;
    this.gaps = 2;

    this.width = this.canvas.width / this.cols;
    this.height = this.canvas.height / 2 / this.rows;
    this.grid = new Array(this.cols * this.rows);
    this.grid.fill(true);
  }

  public draw(): void {
    for (let eachRow = 0; eachRow < this.rows; eachRow++) {
      for (let eachCol = 0; eachCol < this.cols; eachCol++) {
        const index = this.calIndex(eachCol, eachRow);
        if (this.grid[index]){
          new Brick(
            this.ctx,
            this.width * eachCol,
            this.height * eachRow,
            this.width - this.gaps,
            this.height - this.gaps,
            "blue"
          ).draw();
        }
        console.log(this.grid[index]);
      }
    }
  }
  private calIndex(col: number, row: number): number {
    return col + this.cols * row;
  }
}
