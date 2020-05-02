import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Brick } from "../models";
import { GameService } from "../game";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  private clearRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ballX: number = 550;
  private ballY: number = 850;

  private ballSpeedX: number = 5;
  private ballSpeedY: number = 7;

  private readonly PADDLE_WIDTH: number = 100;
  private readonly PADDLE_THICKNESS: number = 10;
  private readonly PADDLE_DIST_FROM_EDGE: number = 60;

  private paddleX: number = 400;
  private paddleY: number = 400;

  private mouseX: number = 0;
  private mouseY: number = 0;

  private readonly BRICK_WIDTH = 40;
  private readonly BRICK_HEIGHT = 40;
  private readonly BRICK_GAP = 2;
  private readonly BRICK_ROWS = 5;
  private readonly BRICK_COLS = 20;
  private bricksGrid: boolean[];
  private brickLeft: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private gameService: GameService
  ) { }
  public ngOnInit(): void {
    // this.start();
    this.newStart();
  }

  private newStart(): void {

    this.gameService.updateModels();
    this.renderer.appendChild(this.el.nativeElement, this.gameService.canvas);
  }

  private start(): void {
    this.bricksGrid = new Array(this.BRICK_COLS * this.BRICK_ROWS);
    this.bricksGrid.fill(true);
    this.canvas = this.renderer.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 500;

    const framesPerSecond: number = 30;
    this.clearRef = setInterval(() => this.updateAll(), 1000 / framesPerSecond);
    this.brickReset();
    this.canvas.addEventListener("mousemove", (event: MouseEvent) =>
      this.updateMousePos(event)
    );

    this.renderer.appendChild(this.el.nativeElement, this.canvas);
  }

  private updateMousePos(event: MouseEvent): void {
    const rect: ClientRect | DOMRect = this.canvas.getBoundingClientRect();
    const root: HTMLElement = document.documentElement;
    this.mouseX = event.clientX - rect.left - root.scrollLeft;
    this.mouseY = event.clientY - rect.top - root.scrollTop;
    this.paddleX = this.mouseX - this.PADDLE_WIDTH / 2;
    this.paddleY = this.mouseY;
  }
  private updateAll(): void {
    this.moveAll();
    this.drawAll();
  }
  private drawAll(): void {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, "black");
    this.drawCircle(this.ballX, this.ballY, 10, "white");
    this.drawRect(
      this.paddleX,
      this.canvas.height - this.PADDLE_DIST_FROM_EDGE,
      this.PADDLE_WIDTH,
      this.PADDLE_THICKNESS,
      "white"
    );
    const mouseBrickX: number = Math.floor(this.mouseX / this.BRICK_WIDTH);
    const mouseBrckY: number = Math.floor(this.mouseY / this.BRICK_HEIGHT);
    const indexAccessing: number = this.calIndex(mouseBrickX, mouseBrckY);

    this.drawBricks();
    /* this.drawText(
      `${mouseBrickX} , ${mouseBrckY}: ${indexAccessing}`,
      this.mouseX + 12,
      this.mouseY + 12,
      "white"
    );
    //this.removeByTouchingTheMouse(indexAccessing);
    // cheat //hack to test in any position
    this.ballX = this.mouseX;
    this.ballY = this.mouseY;
    this.ballSpeedX = 4;
    this.ballSpeedY = -4;*/
  }
  private ballMove(): void {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    if (this.ballX < 0 && this.ballSpeedX < 0.0) {
      this.ballSpeedX *= -1;
    }
    if (this.ballX > this.canvas.width && this.ballSpeedX > 0.0) {
      this.ballSpeedX *= -1;
    }
    if (this.ballY < 0 && this.ballSpeedY < 0.0) {
      this.ballSpeedY *= -1;
    }

    if (this.ballY > this.canvas.height) {
      //this.ballSpeedY *= -1;
      this.brickReset();
      this.ballX = 225;
      this.ballY = 250;
    }
  }
  private paddleBrickHandling(): void {
    const paddleTopEdgeY: number =
      this.canvas.height - this.PADDLE_DIST_FROM_EDGE;
    const paddleBottomEdgeY: number = paddleTopEdgeY + this.PADDLE_THICKNESS;

    const paddleLeftEdgeX: number = this.paddleX;
    const paddleRightEdgeX: number = paddleLeftEdgeX + this.PADDLE_WIDTH;

    if (
      this.ballY >= paddleTopEdgeY && // bellow the top of paddle
      this.ballY <= paddleBottomEdgeY && // above bottom of paddle
      this.ballX >= paddleLeftEdgeX && // right of the left side of paddle
      this.ballX <= paddleRightEdgeX // left of the right side of paddle
    ) {
      this.ballSpeedY *= -1;
      if (this.brickLeft == 0) {
        this.brickReset();
      }
      const centerOfPaddleX: number = this.paddleX + this.PADDLE_WIDTH / 2;
      const ballDistFromPaddleCenterX: number = this.ballX - centerOfPaddleX;
      this.ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    }
  }
  private ballBrickHandling(): void {
    const ballBrickX: number = Math.floor(this.ballX / this.BRICK_WIDTH);
    const ballBrickY: number = Math.floor(this.ballY / this.BRICK_HEIGHT);
    const indexAccessing: number = this.calIndex(ballBrickX, ballBrickY);

    this.removeByTochingTheBall(indexAccessing, ballBrickX, ballBrickY);
  }
  private moveAll(): void {
    this.ballMove();
    this.ballBrickHandling();
    this.paddleBrickHandling();
  }
  private drawRect(
    topLeftX: number,
    topLeftY: number,
    boxWidth: number,
    boxHeight: number,
    fillColor: string
  ): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }
  private drawCircle(
    centerX: number,
    centerY: number,
    radius: number,
    fillColor
  ): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    this.ctx.fill();
  }
  private drawText(
    text: string,
    x: number,
    y: number,
    fillColor: string
  ): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillText(text, x, y);
  }
  private drawBricks(): void {
    for (let eachRow = 0; eachRow < this.BRICK_ROWS; eachRow++) {
      for (let eachCol = 0; eachCol < this.BRICK_COLS; eachCol++) {
        const index = this.calIndex(eachCol, eachRow); // this.BRICK_COLS * eachRow + eachCol;
        if (this.bricksGrid[index])
          this.drawRect(
            this.BRICK_WIDTH * eachCol,
            this.BRICK_HEIGHT * eachRow,
            this.BRICK_WIDTH - this.BRICK_GAP,
            this.BRICK_HEIGHT - this.BRICK_GAP,
            "blue"
          );
      }
    }
  }
  private calIndex(col: number, row: number): number {
    return col + this.BRICK_COLS * row;
  }
  private removeByTouchingTheMouse(mouseIndex: number): void {
    if (mouseIndex >= 0 && mouseIndex < this.BRICK_COLS * this.BRICK_ROWS) {
    }
  }
  private isBrickAtColRow(col: number, row: number): boolean {
    const test: boolean =
      col >= 0 && col < this.BRICK_COLS && row >= 0 && row < this.BRICK_ROWS;
    if (test) {
      const indexCoord: number = this.calIndex(col, row);
      return this.bricksGrid[indexCoord];
    }
    return false;
  }
  private removeByTochingTheBall(ballIndex: number, ballCol, ballRow): void {
    if (
      ballCol >= 0 &&
      ballCol < this.BRICK_COLS &&
      ballRow >= 0 &&
      ballRow < this.BRICK_ROWS
    ) {
      // if (this.bricksGrid[ballIndex]) {
      if (this.isBrickAtColRow(ballCol, ballRow)) {
        this.bricksGrid[ballIndex] = false;
        this.brickLeft--;
        const prevBallX: number = this.ballX - this.ballSpeedX;
        const prevBallY: number = this.ballY - this.ballSpeedY;
        const prevBrickCol: number = Math.floor(prevBallX / this.BRICK_WIDTH);
        const prevBrickRow: number = Math.floor(prevBallX / this.BRICK_HEIGHT);
        let isBothFailed: boolean = false;
        if (prevBrickCol != ballCol) {
          //const abjBrickSide: number = this.calIndex(prevBrickCol, ballCol);
          //if (!this.bricksGrid[abjBrickSide]) {
          if (!this.isBrickAtColRow(ballCol, ballRow)) {
            this.ballSpeedX *= -1;
            isBothFailed = false;
          }
        }
        if (prevBrickRow != ballRow) {
          /*const abjBrickTopBottom: number = this.calIndex(
            prevBrickCol,
            ballRow
          );*/
          //if (!this.bricksGrid[abjBrickTopBottom]) {
          if (!this.isBrickAtColRow(ballCol, prevBrickRow)) {
            this.ballSpeedY *= -1;
            isBothFailed = false;
          }
        }
        if (isBothFailed) {
          this.ballSpeedY *= 1;
          this.ballSpeedX *= 1;
        }
      }
    }
  }
  private brickReset(): void {
    this.bricksGrid = this.bricksGrid.map((value: boolean) => true);
    this.brickLeft = this.bricksGrid.length;
  }
  public ngOnDestroy(): void {
    if (this.clearRef) {
      clearInterval(this.clearRef);
    }
    this.gameService.cleanUp();
  }
}


