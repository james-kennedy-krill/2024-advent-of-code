import * as fs from "fs";

const data = fs.readFileSync("day4-input.txt", "utf-8");
const lines = data.split("\n");

// From X, this matrix looks for M, A, and S in cardinal directions
const XMAS_MATRIX = [
  // Horizontal Forward
  [
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  // Horizontal Backward
  [
    [-1, 0],
    [-2, 0],
    [-3, 0],
  ],
  // Vertical Forwards
  [
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  // Vertical Backwards
  [
    [0, -1],
    [0, -2],
    [0, -3],
  ],
  // Diagonal Down-Right
  [
    [1, 1],
    [2, 2],
    [3, 3],
  ],
  // Diagonal Down-Left
  [
    [-1, 1],
    [-2, 2],
    [-3, 3],
  ],
  // Diagonal Up-Right
  [
    [1, -1],
    [2, -2],
    [3, -3],
  ],
  // Diagonal Up-Left
  [
    [-1, -1],
    [-2, -2],
    [-3, -3],
  ],
];

console.log(
  "Puzzle 1:",
  lines.reduce(
    (total: number, line: string, yIndex: number, _lines: string[]) =>
      Array.from(line).reduce(
        (lineTotal: number, letter: string, xIndex: number) =>
          letter === "X"
            ? XMAS_MATRIX.reduce((matrixTotal: number, matrix: number[][]) => {
                try {
                  const M =
                    _lines[yIndex + matrix[0][1]][xIndex + matrix[0][0]];
                  const A =
                    _lines[yIndex + matrix[1][1]][xIndex + matrix[1][0]];
                  const S =
                    _lines[yIndex + matrix[2][1]][xIndex + matrix[2][0]];

                  if (M === "M" && A === "A" && S === "S") {
                    matrixTotal += 1;
                  }
                  return matrixTotal;
                } catch (error) {
                  return matrixTotal;
                }
              }, lineTotal)
            : lineTotal,
        total
      ),
    0
  )
);

/*
1. Horizontal Forward
   X[1,0][2,0][3,0] - XMAS
2. Horizontal Backwards
   X[-1,0][-2,0][-3,0] - SAMX
3. Vertical Forwards
   X[0,1][0,2][0,3] - X
                      M
                      A
                      S
4. Vertical Backwards
   X[0,-1][0,-2][0,-3] - S
                         A
                         M
                         X
5. Diagonal Down Right
   X[1,1][2,2][3,3] - X
                      .M
                      ..A
                      ...S
6. Diagonal Down Left
   X[-1,1][-2,2][-3,3] -    X
                           M.
                          A..
                         S...
7. Diagonal Up Right (backwards)
   X[1,-1][2,-2][3,-3] - ...S
                         ..A
                         .M
                         X
8. Diagonal Up Left (backwards)
   X[-1,-1][-2,-2][-3,-3] - S...
                             A..
                              M.
                               X
*/

// Puzzle 2 matrix starts from A's and looks for M and S in diagnoals where it makes a cross that says MAS
// So this matrix are cardinal directions from the A to find an M or S combination
const X_MAS_MATRIX = [
  /*
      M.S
      .A.
      M.S
    */
  [
    // M
    [
      [-1, -1],
      [-1, 1],
    ],
    // S
    [
      [1, -1],
      [1, 1],
    ],
  ],
  /*
      S.M
      .A.
      S.M
    */
  [
    // M
    [
      [1, -1],
      [1, 1],
    ],
    // S
    [
      [-1, -1],
      [-1, 1],
    ],
  ],
  /*
    M.M
    .A.
    S.S
  */
  [
    // M
    [
      [-1, -1],
      [1, -1],
    ],
    // S
    [
      [-1, 1],
      [1, 1],
    ],
  ],
  /*
    S.S
    .A.
    M.M
  */
  [
    [
      // M
      [-1, 1],
      [1, 1],
    ],
    // S
    [
      [-1, -1],
      [1, -1],
    ],
  ],
];

console.log(
  "Puzzle 2:",
  lines.reduce(
    (total: number, line: string, yIndex: number, _lines: string[]) =>
      Array.from(line).reduce(
        (lineTotal: number, letter: string, xIndex: number) =>
          letter === "A"
            ? X_MAS_MATRIX.reduce(
                (matrixTotal: number, matrix: number[][][]) => {
                  try {
                    const M1 =
                      _lines[yIndex + matrix[0][0][1]][
                        xIndex + matrix[0][0][0]
                      ];
                    const M2 =
                      _lines[yIndex + matrix[0][1][1]][
                        xIndex + matrix[0][1][0]
                      ];
                    const S1 =
                      _lines[yIndex + matrix[1][0][1]][
                        xIndex + matrix[1][0][0]
                      ];
                    const S2 =
                      _lines[yIndex + matrix[1][1][1]][
                        xIndex + matrix[1][1][0]
                      ];

                    if (M1 === "M" && M2 === "M" && S1 === "S" && S2 === "S") {
                      matrixTotal += 1;
                    }
                    return matrixTotal;
                  } catch (error) {
                    return matrixTotal;
                  }
                },
                lineTotal
              )
            : lineTotal,
        total
      ),
    0
  )
);
