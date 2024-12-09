import * as fs from "fs";

const data = fs.readFileSync("day6-sample.txt", "utf-8");
const OBSTACLE = "#";
const DIRECTION = {
  UP: "^",
  RIGHT: ">",
  LEFT: "<",
  DOWN: "V",
  NULL: ".",
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

let obstacle_loop_locations: LocationCords[] = [];
let obstacle_loop_count = 0;

// TODO
// Need to alter this so that it loops the ray out until either
// it hits an obstacle or it hits the end of the map
function check_path_to_the_right(
  current_location: LocationCords,
  direction: string,
  offset: number = 1
) {
  const check_location_cords = {
    x: 0,
    y: 0,
  };
  let check_location = map_matrix[0][0];
  let obstacle_location = map_matrix[0][0];
  switch (direction) {
    case DIRECTION.UP:
      check_location_cords.x = current_location.x + offset;
      check_location_cords.y = current_location.y;
      check_location =
        map_matrix[check_location_cords.y]?.[check_location_cords.x];
      obstacle_location =
        map_matrix[current_location.y - 1]?.[current_location.x];
      if (
        check_location &&
        check_location.visited &&
        check_location.direction === DIRECTION.RIGHT &&
        obstacle_location &&
        obstacle_location.location_character !== OBSTACLE
      ) {
        obstacle_loop_locations.push({
          x: obstacle_location.location_index[0],
          y: obstacle_location.location_index[1],
        });
        obstacle_loop_count++;
        return true;
      } else if (
        check_location &&
        !check_location.visited &&
        !check_location.obstacle
      ) {
        // check next location
        return check_path_to_the_right(current_location, direction, offset + 1);
      } else {
        return false;
      }
      break;
    case DIRECTION.RIGHT:
      check_location_cords.x = current_location.x;
      check_location_cords.y = current_location.y + offset;
      check_location =
        map_matrix[check_location_cords.y]?.[check_location_cords.x];
      obstacle_location =
        map_matrix[current_location.y]?.[current_location.x + 1];
      if (
        check_location &&
        check_location.visited &&
        check_location.direction === DIRECTION.DOWN &&
        obstacle_location &&
        obstacle_location.location_character !== OBSTACLE
      ) {
        obstacle_loop_locations.push({
          x: obstacle_location.location_index[0],
          y: obstacle_location.location_index[1],
        });
        obstacle_loop_count++;
        return true;
      } else if (
        check_location &&
        !check_location.visited &&
        !check_location.obstacle
      ) {
        // check next location
        return check_path_to_the_right(current_location, direction, offset + 1);
      } else {
        return false;
      }
      break;
    case DIRECTION.DOWN:
      check_location_cords.x = current_location.x - offset;
      check_location_cords.y = current_location.y;
      check_location =
        map_matrix[check_location_cords.y]?.[check_location_cords.x];
      obstacle_location =
        map_matrix[current_location.y + 1]?.[current_location.x];
      if (
        check_location &&
        check_location.visited &&
        check_location.direction === DIRECTION.LEFT &&
        obstacle_location &&
        obstacle_location.location_character !== OBSTACLE
      ) {
        obstacle_loop_locations.push({
          x: obstacle_location.location_index[0],
          y: obstacle_location.location_index[1],
        });
        obstacle_loop_count++;
        return true;
      } else if (
        check_location &&
        !check_location.visited &&
        !check_location.obstacle
      ) {
        // check next location
        return check_path_to_the_right(current_location, direction, offset + 1);
      } else {
        return false;
      }
      break;
    case DIRECTION.LEFT:
      check_location_cords.x = current_location.x;
      check_location_cords.y = current_location.y - offset;
      check_location =
        map_matrix[check_location_cords.y]?.[check_location_cords.x];
      obstacle_location =
        map_matrix[current_location.y]?.[current_location.x - 1];
      if (
        check_location &&
        check_location.visited &&
        check_location.direction === DIRECTION.UP &&
        obstacle_location &&
        obstacle_location.location_character !== OBSTACLE
      ) {
        obstacle_loop_locations.push({
          x: obstacle_location.location_index[0],
          y: obstacle_location.location_index[1],
        });
        obstacle_loop_count++;
        return true;
      } else if (
        check_location &&
        !check_location.visited &&
        !check_location.obstacle
      ) {
        // check next location
        return check_path_to_the_right(current_location, direction, offset + 1);
      } else {
        return false;
      }
      break;
  }
  return false;
}

// Move
while (
  guard.location.x >= 0 &&
  guard.location.x <= bounds.x &&
  guard.location.y >= 0 &&
  guard.location.y <= bounds.y
) {
  // set the current location of the guard in the matrix to be visited
  map_matrix[guard.location.y][guard.location.x].visited = true;
  map_matrix[guard.location.y][guard.location.x].direction = guard.direction;
  // console.log(guard.location);
  check_path_to_the_right(guard.location, guard.direction);

  // move the guard (update values depending on the direction of the guard)
  switch (guard.direction) {
    case DIRECTION.UP:
      guard.location.y -= 1;
      if (
        map_matrix[guard.location.y - 1]?.[guard.location.x]
          ?.location_character === OBSTACLE
      ) {
        guard.direction = DIRECTION.RIGHT;
      }
      break;
    case DIRECTION.RIGHT:
      guard.location.x += 1;
      if (
        map_matrix[guard.location.y]?.[guard.location.x + 1]
          ?.location_character === OBSTACLE
      ) {
        guard.direction = DIRECTION.DOWN;
      }
      break;
    case DIRECTION.DOWN:
      guard.location.y += 1;
      if (
        map_matrix[guard.location.y + 1]?.[guard.location.x]
          ?.location_character === OBSTACLE
      ) {
        guard.direction = DIRECTION.LEFT;
      }
      break;
    case DIRECTION.LEFT:
      guard.location.x -= 1;
      if (
        map_matrix[guard.location.y]?.[guard.location.x - 1]
          ?.location_character === OBSTACLE
      ) {
        guard.direction = DIRECTION.UP;
      }
      break;
  }
}
console.log("GUARD END:", guard);
console.log("OBSTACLE LOOPS:", obstacle_loop_locations);
console.log("OBSTACLE LOOP COUNT: ", obstacle_loop_count);

guard.location.x = guard_start.location.x;
guard.location.y = guard_start.location.y;
guard.direction = guard_start.direction;

// console.log("GUARD START AGAIN: ", guard);
// console.log("MAP MATRIX: ", map_matrix);
map_matrix.forEach((line) => {
  console.log(
    line
      .map((location) => (location.obstacle ? "#" : location.direction))
      .join(""),
    "\n"
  );
});

console.log(
  "Puzzle 1:",
  map_matrix.reduce(
    (total, line) =>
      line.reduce(
        (_total, location) => (location.visited ? (_total += 1) : _total),
        total
      ),
    0
  )
);
