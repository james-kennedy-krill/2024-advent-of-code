import * as fs from "fs";

const data = fs.readFileSync("day6-sample.txt", "utf-8");
const OBSTACLE = "#";
const DIRECTION = {
  UP: "^",
  RIGHT: ">",
  LEFT: "<",
  DOWN: "V",
  NULL: "",
};

interface Guard {
  location: {
    x: number;
    y: number;
  };
  direction: string;
}
interface Location {
  location_index: number[];
  location_character: string;
  obstacle: boolean;
  visited: boolean;
  direction: string;
  obstacle_hits: {
    TOP: number;
    RIGHT: number;
    BOTTOM: number;
    LEFT: number;
  };
}
interface LocationCords {
  x: number;
  y: number;
}

const lines = data.split("\n");
if (lines[lines.length - 1] === "") lines.pop();

const bounds: LocationCords = {
  x: lines[0].length - 1,
  y: lines.length - 1,
};

const guard: Guard = {
  location: {
    x: 0,
    y: 0,
  },
  direction: DIRECTION.UP,
};

const map_matrix: Location[][] = lines.map((line, line_index) =>
  Array.from(line).map((location, location_index) => {
    if (location === "^") {
      guard.location.x = location_index;
      guard.location.y = line_index;
      guard.direction = DIRECTION.UP;
    }
    return {
      location_index: [location_index, line_index],
      location_character: location,
      obstacle: location === OBSTACLE,
      visited: location === "^",
      direction: DIRECTION.NULL,
      obstacle_hits: {
        TOP: 0,
        RIGHT: 0,
        BOTTOM: 0,
        LEFT: 0,
      },
    };
  })
);

function run_simulation(_lines: string[], _map_matrix: Location[][]) {
  let is_loop = false;
  const _this_matrix = JSON.parse(JSON.stringify(_map_matrix));
  let obstacle_loop_locations: LocationCords[] = [];
  let obstacle_loop_count = 0;

  const guard_start: Guard = {
    location: {
      x: guard.location.x,
      y: guard.location.y,
    },
    direction: guard.direction,
  };

  // Move
  while (
    guard.location.x >= 0 &&
    guard.location.x <= bounds.x &&
    guard.location.y >= 0 &&
    guard.location.y <= bounds.y &&
    !is_loop
  ) {
    // set the current location of the guard in the matrix to be visited
    _this_matrix[guard.location.y][guard.location.x].visited = true;
    _this_matrix[guard.location.y][guard.location.x].direction =
      guard.direction;

    let _obstacle: Location | null = null;

    // move the guard (update values depending on the direction of the guard)
    switch (guard.direction) {
      case DIRECTION.UP:
        guard.location.y -= 1;
        _obstacle = _this_matrix[guard.location.y - 1]?.[guard.location.x];
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.BOTTOM++;
          if (_obstacle.obstacle_hits.BOTTOM > 1) {
            console.log(_obstacle);
            is_loop = true;
          }
          guard.direction = DIRECTION.RIGHT;
        }
        break;
      case DIRECTION.RIGHT:
        guard.location.x += 1;
        _obstacle = _this_matrix[guard.location.y]?.[guard.location.x + 1];
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.LEFT++;
          if (_obstacle.obstacle_hits.LEFT > 1) {
            console.log(_obstacle);
            is_loop = true;
          }
          guard.direction = DIRECTION.DOWN;
        }
        break;
      case DIRECTION.DOWN:
        guard.location.y += 1;
        _obstacle = _this_matrix[guard.location.y + 1]?.[guard.location.x];
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.TOP++;
          if (_obstacle.obstacle_hits.TOP > 1) {
            console.log(_obstacle);
            is_loop = true;
          }
          guard.direction = DIRECTION.LEFT;
        }
        break;
      case DIRECTION.LEFT:
        guard.location.x -= 1;
        _obstacle = _this_matrix[guard.location.y]?.[guard.location.x - 1];
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.RIGHT++;
          if (_obstacle.obstacle_hits.RIGHT > 1) {
            console.log(_obstacle);
            is_loop = true;
          }
          guard.direction = DIRECTION.UP;
        }
        break;
    }
  }
  return is_loop || _this_matrix;
}

const simulation_result: Location[][] | boolean = run_simulation(
  lines,
  map_matrix
);

console.log(simulation_result);

function print_matrix(_matrix: Location[][]) {
  console.log(" ", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].join(" "));

  _matrix.forEach((line, y_index) => {
    console.log(
      y_index,
      line
        .map((location) =>
          location.obstacle
            ? "#"
            : location.direction || location.location_character
        )
        .join(" "),
      "\n"
    );
  });
}

console.log("----- ORIGINAL MATRIX ------\n");
print_matrix(map_matrix);

if (simulation_result && typeof simulation_result === "object") {
  console.log("\n----- FINAL MATRIX ------\n");
  print_matrix(simulation_result);

  console.log(
    "Puzzle 1:",
    simulation_result.reduce(
      (total, line) =>
        line.reduce(
          (_total, location) => (location.visited ? (_total += 1) : _total),
          total
        ),
      0
    )
  );
}
