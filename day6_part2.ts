import * as fs from "fs";

const data = fs.readFileSync("day6-input.txt", "utf-8");
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

const guard_start: Guard = {
  location: {
    x: guard.location.x,
    y: guard.location.y,
  },
  direction: guard.direction,
};

const obstacle_loop_locations: LocationCords[] = [];

function run_simulation(
  _lines: string[],
  _map_matrix: Location[][],
  test_loops = true
) {
  let is_loop = false;
  const _this_matrix = JSON.parse(JSON.stringify(_map_matrix));
  const _guard = JSON.parse(JSON.stringify(guard_start));

  // Move
  while (
    _guard.location.x >= 0 &&
    _guard.location.x <= bounds.x &&
    _guard.location.y >= 0 &&
    _guard.location.y <= bounds.y &&
    !is_loop
  ) {
    // set the current location of the guard in the matrix to be visited
    _this_matrix[_guard.location.y][_guard.location.x].visited = true;
    _this_matrix[_guard.location.y][_guard.location.x].direction =
      _guard.direction;

    let _obstacle: Location | null = null;
    let _map_copy: Location[][] = JSON.parse(JSON.stringify(_map_matrix));

    // move the guard (update values depending on the direction of the guard)
    switch (_guard.direction) {
      case DIRECTION.UP:
        _guard.location.y -= 1;
        _obstacle = _this_matrix[_guard.location.y - 1]?.[_guard.location.x];

        if (!_obstacle) continue;
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.BOTTOM++;
          if (_obstacle.obstacle_hits.BOTTOM > 1) {
            is_loop = true;
          }
          _guard.direction = DIRECTION.RIGHT;
        } else if (test_loops) {
          _map_copy[_guard.location.y - 1][
            _guard.location.x
          ].location_character = "#";
          _map_copy[_guard.location.y - 1][_guard.location.x].obstacle = true;
          if (run_simulation(_lines, _map_copy, false) === true) {
            // if this returns a loop
            obstacle_loop_locations.push({
              x: _guard.location.x,
              y: _guard.location.y - 1,
            });
          }
        }
        break;
      case DIRECTION.RIGHT:
        _guard.location.x += 1;
        _obstacle = _this_matrix[_guard.location.y]?.[_guard.location.x + 1];
        if (!_obstacle) continue;
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.LEFT++;
          if (_obstacle.obstacle_hits.LEFT > 1) {
            is_loop = true;
          }
          _guard.direction = DIRECTION.DOWN;
        } else if (test_loops) {
          _map_copy[_guard.location.y][
            _guard.location.x + 1
          ].location_character = "#";
          _map_copy[_guard.location.y][_guard.location.x + 1].obstacle = true;
          if (run_simulation(_lines, _map_copy, false) === true) {
            // if this returns a loop
            obstacle_loop_locations.push({
              x: _guard.location.x + 1,
              y: _guard.location.y,
            });
          }
        }
        break;
      case DIRECTION.DOWN:
        _guard.location.y += 1;
        _obstacle = _this_matrix[_guard.location.y + 1]?.[_guard.location.x];
        if (!_obstacle) continue;
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.TOP++;
          if (_obstacle.obstacle_hits.TOP > 1) {
            is_loop = true;
          }
          _guard.direction = DIRECTION.LEFT;
        } else if (test_loops) {
          _map_copy[_guard.location.y + 1][
            _guard.location.x
          ].location_character = "#";
          _map_copy[_guard.location.y + 1][_guard.location.x].obstacle = true;
          if (run_simulation(_lines, _map_copy, false) === true) {
            // if this returns a loop
            obstacle_loop_locations.push({
              x: _guard.location.x,
              y: _guard.location.y + 1,
            });
          }
        }
        break;
      case DIRECTION.LEFT:
        _guard.location.x -= 1;
        _obstacle = _this_matrix[_guard.location.y]?.[_guard.location.x - 1];
        if (!_obstacle) continue;
        if (_obstacle?.location_character === OBSTACLE) {
          _obstacle.obstacle_hits.RIGHT++;
          if (_obstacle.obstacle_hits.RIGHT > 1) {
            is_loop = true;
          }
          _guard.direction = DIRECTION.UP;
        } else if (test_loops) {
          _map_copy[_guard.location.y][
            _guard.location.x - 1
          ].location_character = "#";
          _map_copy[_guard.location.y][_guard.location.x - 1].obstacle = true;
          if (run_simulation(_lines, _map_copy, false) === true) {
            // if this returns a loop
            obstacle_loop_locations.push({
              x: _guard.location.x - 1,
              y: _guard.location.y,
            });
          }
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

console.log("----- ORIGINAL MATRIX ------\n");
print_matrix(map_matrix);

if (simulation_result && typeof simulation_result === "object") {
  console.log("\n----- FINAL MATRIX ------\n");
  print_matrix(simulation_result);

  const obstacleLoopSet = new Set(
    obstacle_loop_locations.map((loc) => JSON.stringify(loc))
  );

  // Convert back to LocationCords[]
  const uniqueLocations = Array.from(obstacleLoopSet).map((loc) =>
    JSON.parse(loc)
  );

  console.log("Puzzle 2:", uniqueLocations.length, uniqueLocations);
}
