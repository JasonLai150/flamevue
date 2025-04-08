

// Optional: Bilinear interpolate temperature based on neighboring cell values.
fn sample_temperature(coord: vec2<f32>) -> f32 {
  // Calculate the integer (floor) and fractional parts.
  let coord0 = floor(coord);
  let coord1 = coord0 + vec2<f32>(1.0, 0.0);
  let coord2 = coord0 + vec2<f32>(0.0, 1.0);
  let coord3 = coord0 + vec2<f32>(1.0, 1.0);

  // Convert coordinates to linear indices.
  let idx0 = u32(coord_to_index(coord0));
  let idx1 = u32(coord_to_index(coord1));
  let idx2 = u32(coord_to_index(coord2));
  let idx3 = u32(coord_to_index(coord3));

  // Fetch temperature values from the input (ensure indices are in bounds, or clamp if necessary).
  let t0 = input[idx0].temperature;
  let t1 = input[idx1].temperature;
  let t2 = input[idx2].temperature;
  let t3 = input[idx3].temperature;

  let f = fract(coord);
  // Interpolate horizontally and then vertically.
  let tA = mix(t0, t1, f.x);
  let tB = mix(t2, t3, f.x);
  return mix(tA, tB, f.y);
}

@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;
  if (index >= count) {
    return;
  }

  // Get current cell state.
  let currentCell = input[index];
  var newCell = currentCell; // Start with existing state.

  // Determine the current cell coordinate.
  let coord = index_to_coord(f32(index));

  // For temperature advection, backtrace position along the velocity vector.
  // Note that you might want to scale the velocity appropriately; here we use delta_time.
  let currentPos = coord;
  let v = currentCell.velocity;
  let previousPos = currentPos - uniforms.delta_time * v;

  // Optionally, clamp previousPos within valid coordinate range.
  let clampedPos = clamp(previousPos, vec2<f32>(0.0, 0.0), uniforms.simulation_resolution - vec2<f32>(1.0, 1.0));

  // Sample the temperature from the previous position via bilinear interpolation.
  let advectedTemperature = sample_temperature(clampedPos);
  
  // Update the cell's temperature with the advected value.
  newCell.temperature = advectedTemperature;
  
  // Write the updated cell back.
  output[index] = newCell;
}
