import { divide, scaleComponents, V } from "rokay/math/v"


export const
  GRAVITY = V(0, 180),

  /**
   * the size of the board in cells
   **/
  SIZE_BOARD = V(8, 8),
  /**
   * the size of a cell in pixels
   **/
  SIZE_CELL = V(16, 16),
  SIZE_BOARD_PIXELS = scaleComponents(SIZE_BOARD, SIZE_CELL),
  /**
   * half the size of a cell in pixels
   **/
  SIZE_CELL_HALF = divide(SIZE_CELL, 2)
