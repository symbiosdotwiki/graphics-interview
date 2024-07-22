import React from "react";
import Sketch from "react-p5"

class Box {
  constructor(p5, x, y, dx, dy) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.size = 50
    this.color = p5.color(255, 255, 0)
    this.p5 = p5
  }

  bounceX() {
    this.dx *= -1
    this.x += this.dx * 1.1
  }
  bounceY() {
    this.dy *= -1
    this.y += this.dy * 1.1
  }

  move() {
    this.x += this.dx
    this.y += this.dy
    if (this.x < 0 || this.x > this.p5.width - this.size) {
      this.bounceX()
      this.changeColor()
    }
    if (this.y < 0 || this.y > this.p5.height - this.size) {
      this.bounceY()
      this.changeColor()
    }
  }

  display() {
    this.p5.fill(this.color)
    this.p5.rect(this.x, this.y, this.size, this.size)
  }

  collidesWith(other) {
    return (
      this.x < other.x + other.size &&
      this.x + this.size > other.x &&
      this.y < other.y + other.size &&
      this.y + this.size > other.y
    );
  }

  bounce(other) {
    const overlapX = Math.min(
      this.x + this.size - other.x,
      other.x + other.size - this.x
    );
    const overlapY = Math.min(
      this.y + this.size - other.y,
      other.y + other.size - this.y
    );

    if (overlapX < overlapY) {
      this.bounceX()
    } else {
      this.bounceY()
    }
  }

  changeColor() {
    this.color = this.p5.color(this.p5.random(255), this.p5.random(255), this.p5.random(255))
  }

}

const P5 = (props) => {

  let x = 50
  let y = 50

  let boxes = []

  const setup = (p5, canvasParentRef) => {
    boxes = []
    p5.createCanvas(500, 500).parent(canvasParentRef)

    for (let i = 0; i < 4; i++) {
      boxes.push(new Box(p5, p5.random(p5.width - 10), p5.random(p5.height - 10), p5.random(2, 5), p5.random(2, 5)))
    }
    console.log("NUM BOXES: ", boxes.length)
  }

  const draw = (p5) => {
    p5.background(220)
    for (let i = 0; i < boxes.length; i++) {
      let box = boxes[i]
      box.move()
      box.display()

      for (let j = i + 1; j < boxes.length; j++) {
        // console.log("COLLISION: ", i, ", ", j)
        let boxCheck = boxes[j]
        let collide = box.collidesWith(boxCheck)

        if (collide) {
              box.bounce(boxCheck);
              boxCheck.bounce(box);
              box.changeColor();
              boxCheck.changeColor();
            }

      }
    }
  }

  return <Sketch setup={setup} draw={draw} />
}

export default P5