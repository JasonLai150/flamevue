import{C as A,c as v,H as T,R as j,s as x,U as Y,S as q,P as H,a as u,G as X,p as W,b as K,d as N,e as Z}from"./twgl-full.module-f5b32412.js";const i=`struct CellData {
  velocity : vec2<f32>,
  divergence : f32,
  pressure : f32,
  temperature: f32,
}

@group(0) @binding(0) var<storage, read> input : array<CellData>;
@group(0) @binding(1) var<storage, read_write> output : array<CellData>;

struct Uniforms {
  resolution : vec2<f32>,
  simulation_resolution : vec2<f32>,
  delta_time : f32,
  buoyancy: f32,
  viscosity : f32,
  mouse_position : vec2<f32>,
  mouse_delta : vec2<f32>,
  temperature_decay: f32,
  velocity_damping: f32,
  gravity_force: f32,
  noise_strength: f32,
  elapsed_time: f32,
  temp_injected: f32,
  heat_radius: f32
}

@group(1) @binding(0) var<uniform> uniforms : Uniforms;`,r=`fn index_to_coord(index: f32) -> vec2<f32> {
  var x = floor(index % uniforms.simulation_resolution.x);
  var y = floor(index / uniforms.simulation_resolution.x);

  return vec2<f32>(x, y);
}

fn coord_to_index(coord: vec2<f32>) -> f32 {
  return (uniforms.simulation_resolution.x) * coord.y + coord.x;
}

fn coord_to_position(coord: vec2<f32>) -> vec2<f32> {
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  return coord / scale;
}

fn position_to_coord(position: vec2<f32>) -> vec2<f32> {
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  return position * scale;
}

fn get_cell_bilinear(grid_position: vec2<f32>) -> CellData {
  var result: CellData; 


  var coord_a = floor(grid_position);
  var coord_b = vec2<f32>(ceil(grid_position.x), floor(grid_position.y));
  var coord_c = ceil(grid_position);
  var coord_d = vec2<f32>(floor(grid_position.x), ceil(grid_position.y));

  let index_a = u32(coord_to_index(coord_a));
  let index_b = u32(coord_to_index(coord_b));
  let index_c = u32(coord_to_index(coord_c));
  let index_d = u32(coord_to_index(coord_d));//originally let index_d = u32(coord_to_index(coord_b));

  let cell_a = input[index_a];
  let cell_b = input[index_b];
  let cell_c = input[index_c];
  let cell_d = input[index_d];

  let u = grid_position.x - coord_a.x;
  let v = grid_position.y - coord_a.y;

  result.velocity = mix(mix(cell_a.velocity, cell_b.velocity, u), mix(cell_d.velocity, cell_c.velocity, u), v);
  result.divergence = mix(mix(cell_a.divergence, cell_b.divergence, u), mix(cell_d.divergence, cell_c.divergence, u), v);
  result.pressure = mix(mix(cell_a.pressure, cell_b.pressure, u), mix(cell_d.pressure, cell_c.pressure, u), v);
  result.temperature = mix(mix(cell_a.temperature, cell_b.temperature, u), mix(cell_d.temperature, cell_c.temperature, u), v);


  return result;
}

fn get_neighboring_position_values(position: vec2<f32>, offset_distance: vec2<f32>) -> array<CellData, 4> {
  var result: array<CellData, 4>;

  let position_up = vec2<f32>(position.x, clamp(position.y - offset_distance.y, 0, uniforms.resolution.y - 1));
  let position_right = vec2<f32>(clamp(position.x + offset_distance.x, 0, uniforms.resolution.x - 1), position.y);
  let position_down = vec2<f32>(position.x, clamp(position.y + offset_distance.y, 0, uniforms.resolution.y - 1));
  let position_left = vec2<f32>(clamp(position.x - offset_distance.x, 0, uniforms.resolution.x - 1), position.y);

  result[0] = get_cell_bilinear(position_to_coord(position_up));
  result[1] = get_cell_bilinear(position_to_coord(position_right));
  result[2] = get_cell_bilinear(position_to_coord(position_down));
  result[3] = get_cell_bilinear(position_to_coord(position_left));

  return result;
}

fn is_boundary(coord: vec2<f32>) -> bool {
  if (coord.x <= 0 || coord.y <= 0 || coord.x >= uniforms.simulation_resolution.x - 1 || coord.y >= uniforms.simulation_resolution.y - 1) {
    return true;
  }
  return false;
}`,J=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }
  
  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (!is_boundary(coord)) {
    return;
  }

  if (
    (coord.y == 0 && coord.x == 0) ||
    (coord.x == uniforms.simulation_resolution.x -1 && coord.y == 0) ||
    (coord.x == uniforms.simulation_resolution.x -1 && coord.y ==uniforms.simulation_resolution.y -1) ||
    (coord.x == 0 && coord.y == uniforms.simulation_resolution.y -1)
  ) {
    return;
  }

  var normal: vec2<f32>;

  if (coord.y == 0) {
    normal = vec2<f32>(0, 1);
  } else if (coord.y == uniforms.simulation_resolution.y - 1) {
    normal = vec2<f32>(0, -1);
  } else if (coord.x == 0) {
    normal = vec2<f32>(1, 0);
  } else if (coord.x == uniforms.simulation_resolution.x -1) {
    normal = vec2<f32>(-1, 0);
  }

  var inner_coord = coord + normal;
  var inner_index = coord_to_index(inner_coord);
  var inner_data = input[u32(inner_index)];


  (*next_state).velocity = inner_data.velocity * -1;
  (*next_state).pressure = inner_data.pressure;
  (*next_state).divergence = inner_data.divergence;
}`,Q=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;// * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let distance_to_mouse = distance(uniforms.mouse_position, coord_to_position(coord));
  var strength = 1 - distance_to_mouse / uniforms.resolution;
 
 //mouse effects
  strength = smoothstep(vec2<f32>(0.95), vec2<f32>(1), strength) * 2.0;
  var velocity = uniforms.mouse_delta * strength * strength;
  
  (*next_state).velocity = (*next_state).velocity + velocity;

  //gravity
  let gravity = vec2<f32>(0.0, uniforms.gravity_force);
  (*next_state).velocity += gravity * uniforms.delta_time;

  //Buoyancy
  let ambient_temperature = 0.0;
  let buoyant_force = uniforms.buoyancy * (current_state.temperature - ambient_temperature);
  (*next_state).velocity.y -= buoyant_force * uniforms.delta_time;

  //air drag
  let damping = uniforms.velocity_damping;
  (*next_state).velocity *= damping;

  //let flickerx = sin(pos.x * 10.0 + uniforms.elapsed_time * 30.0) * cos(pos.y * 10.0 - uniforms.elapsed_time * 20.0);
  //let flicker_strength_x = flickerx * current_state.temperature * 0.1;

  //(*next_state).velocity.x += noise * flicker_strength_x;
  //(*next_state).velocity.y += noise*flicker_strength_y;

  //grid based wind
  let pos = coord_to_position(coord);
  let noise = uniforms.noise_strength;

  let gridCoord = vec2<u32>(u32(pos.x), u32(pos.y));
  let windCell = gridCoord / 16u;

  let timeCycle = floor(uniforms.elapsed_time * 0.1);

  let windSeed = windCell + vec2<u32>(u32(timeCycle));
  let angle = hash2(windSeed) * 6.2831853;

  let wind = vec2<f32>(cos(angle), sin(angle));

  (*next_state).velocity += noise * wind;
}

fn hash2(p: vec2<u32>) -> f32 {
  var x = p.x * 374761393u + p.y * 668265263u;
  x = (x ^ (x >> 13u)) * 1274126177u;
  return f32(x & 0x7FFFFFFFu) / f32(0x7FFFFFFF); // ∈ [0, 1]
}
`,ee=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }
  
  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let position = coord_to_position(coord);
  let previous_grid_position = position - (*next_state).velocity * uniforms.delta_time;
  let interpolated_cell_data = get_cell_bilinear(position_to_coord(previous_grid_position));
  (*next_state).velocity = interpolated_cell_data.velocity;

}`,ne=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }
  let position = coord_to_position(coord);

  let current_velocity = current_state.velocity;
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(2) / scale;
  
  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];

  var velocity = 4.0 * current_velocity + uniforms.viscosity * uniforms.delta_time * (up.velocity + right.velocity + down.velocity + left.velocity);
  velocity = velocity / (4 * (1 + uniforms.viscosity * uniforms.delta_time)); 

  (*next_state).velocity = velocity;
}`,te=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }
  let position = coord_to_position(coord);
  
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(1) / scale;

  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];
  let divergence = (right.velocity.x - left.velocity.x + down.velocity.y - up.velocity.y) / 2;

  (*next_state).velocity = current_state.velocity;
  (*next_state).divergence = divergence / uniforms.delta_time;
}`,oe=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let position = coord_to_position(coord);
  
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(2) / scale;
  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];

  (*next_state).divergence = current_state.divergence;
  (*next_state).pressure = (up.pressure + right.pressure + down.pressure + left.pressure) / 4 - current_state.divergence;
}`,ie=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let position = coord_to_position(coord);
  
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(1) / scale;

  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];

  let grad_pressure = vec2<f32>(right.pressure - left.pressure, down.pressure - up.pressure) * 0.5;

  // ✅ Subtract pressure gradient additively
  (*next_state).velocity -= grad_pressure * uniforms.delta_time;
}
`,re=`

/*struct VertexInput {
  @location(0) position : vec4<f32>,
  @location(2) texcoord : vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) texcoord : vec2<f32>,
}
@vertex
fn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = vec4<f32>(vert.position.x, vert.position.z, 0, 1);
  output.texcoord = vec2<f32>(vert.texcoord.x, 1 - vert.texcoord.y);
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = in.texcoord * uniforms.simulation_resolution;
  let interpolated_cell_data = get_cell_bilinear(coord);

  var scaled_velocity = interpolated_cell_data.velocity * 0.001;
  var velocity_color = vec4<f32>((scaled_velocity.xy + 1) / 2, 1, 1);

  velocity_color = mix(vec4<f32>(0,0,0,1), velocity_color, smoothstep(0, uniforms.resolution.x * 0.2, length(interpolated_cell_data.velocity)));

  // return mix(vec4<f32>(1), color, length(scaled_velocity));
  var scaled_divergence = interpolated_cell_data.divergence * 0.1 * uniforms.delta_time;
  var divergence_color = vec4(scaled_divergence, scaled_divergence,scaled_divergence, 1);

  var scaled_pressure = interpolated_cell_data.divergence * 0.1 * uniforms.delta_time;
  var pressure_color = vec4(scaled_pressure, scaled_pressure, scaled_pressure, 1);
  return velocity_color;
  // return vec4<f32>(uniforms.pose_deltas[0].xy * 0.001, 0, 1);

}*/

struct VertexInput {
  @location(0) position : vec4<f32>,
  @location(2) texcoord : vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) texcoord : vec2<f32>,
}

@vertex
fn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = vec4<f32>(vert.position.x, vert.position.z, 0, 1);
  output.texcoord = vec2<f32>(vert.texcoord.x, 1 - vert.texcoord.y);
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Convert the texture coordinate to a simulation grid coordinate.
  let coord = in.texcoord * uniforms.simulation_resolution;
  
  // Interpolate the cell data at the given coordinate.
  let interpolated_cell_data = get_cell_bilinear(coord);

  // Get the temperature value from the cell.
  let t = interpolated_cell_data.temperature;
  let heatRatio = clamp(t / uniforms.temp_injected, 0.0, 1.0); // Clamp for safety

  var color: vec4<f32>;

  if (heatRatio < 0.002) {
  // Smoke: gray → black
  let tt = heatRatio / 0.002;
  color = mix(vec4<f32>(0.15, 0.15, 0.15, 1.0), vec4<f32>(0.0, 0.0, 0.0, 1.0), tt);

  } else if (heatRatio < 0.005) {
    // Black → red
    let tt = (heatRatio - 0.002) / 0.003;
    color = mix(vec4<f32>(0.0, 0.0, 0.0, 1.0), vec4<f32>(1.0, 0.0, 0.0, 1.0), tt);

  } else if (heatRatio < 0.015) {
    // Red → orange
    let tt = (heatRatio - 0.005) / 0.01;
    color = mix(vec4<f32>(1.0, 0.0, 0.0, 1.0), vec4<f32>(1.0, 0.5, 0.0, 1.0), tt);

  } else if (heatRatio < 0.03) {
    // Orange → yellow
    let tt = (heatRatio - 0.015) / 0.015;
    color = mix(vec4<f32>(1.0, 0.5, 0.0, 1.0), vec4<f32>(1.0, 1.0, 0.0, 1.0), tt);

  } else {
    // Yellow → white
    let tt = min((heatRatio - 0.03) / 0.02, 1.0);
    color = mix(vec4<f32>(1.0, 1.0, 0.0, 1.0), vec4<f32>(1.0, 1.0, 1.0, 1.0), tt);
  }
  return color;
}
`,le=`@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID: vec3<u32>) {
  let index = GlobalInvocationID.x;
  if (index >= arrayLength(&output)) {
    return;
  }

  let simRes = uniforms.simulation_resolution;
  let cellX = f32(index % u32(simRes.x));
  let cellY = f32(index / u32(simRes.x));
  let cellPos = index_to_coord(f32(index));

  let wickPos = vec2<f32>(simRes.x * 0.5, simRes.y * 0.8);
  let dist = distance(cellPos, wickPos);

  let heatRadius = 10.0;
  
  // Read the current simulation data.
  let cell = input[index];
  var updatedCell = cell;
  
  if (dist < uniforms.heat_radius) {
    let heatFactor = 1.0 - (dist / uniforms.heat_radius);
    let heatAmount = uniforms.temp_injected * heatFactor * uniforms.delta_time;
    updatedCell.temperature = cell.temperature + heatAmount;
  }
  
  output[index] = updatedCell;
}
`,ae=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;
  if (index >= count) {
    return;
  }

  // Get current state and initialize next state
  var currentCell = input[index];
  var newCell = currentCell;

  // Compute 2D grid coordinate
  let coord = index_to_coord(f32(index));

  // Skip boundary cells
  if (is_boundary(coord)) {
    return;
  }

  // Convert grid coord to world-space position
  let position = coord_to_position(coord);

  // Backtrace using velocity
  let previous_position = position - currentCell.velocity * uniforms.delta_time;

  // Convert back to grid-space coordinate for sampling
  let previous_coord = position_to_coord(previous_position);

  // Sample interpolated cell data at backtraced location
  let sampled = get_cell_bilinear(previous_coord);

  // Update temperature with advected value
  newCell.temperature = sampled.temperature;

  //temperature decay
  newCell.temperature *= exp(-uniforms.temperature_decay * uniforms.delta_time);

  // Store result
  output[index] = newCell;
}
`,d=256,h=.25,se=2.5,ce=document.querySelector("canvas"),w=new A;let l,a;const C=v(),f=v();let y=!1;const b=v(),p=v();let s,t,S,R,$,k,F,P,I,D,V,z;const L=()=>{const{delta:e}=w.tick();N(p,p,1-.01*e),s.member.delta_time=Math.max(Math.min(e,33.33),8)/400,s.member.mouse_position=b,s.member.mouse_delta=p,s.member.elapsed_time=w.elapsedTime,l.run(S),t.step(),l.run(D),t.step(),l.run(V),t.step(),l.run(R),t.step(),l.run($),t.step();for(let c=0;c<24;c++)l.run(k),t.step();l.run(F),t.step();for(let c=0;c<24;c++)l.run(P),t.step();l.run(I),t.step(),a.render(z),requestAnimationFrame(L)},ue=e=>{if(!y)return;const{clientX:c,clientY:n,movementX:o,movementY:g}=e;p[0]+=o,p[1]+=g,x(b,c*a.pixelRatio,n*a.pixelRatio)},de=()=>y=!0,_e=()=>y=!1,pe=async()=>{const e=await T.requestWebGPU();l=new Z(e),a=new j(e,ce),x(C,a.width,a.height),x(f,Math.round(a.width*h),Math.round(a.height*h)),s=new Y(e,{resolution:C,simulation_resolution:f,delta_time:8.33/400,buoyancy:25,viscosity:se,mouse_position:b,mouse_delta:p,temperature_decay:3,velocity_damping:1,gravity_force:50,noise_strength:3,elapsed_time:0,temp_injected:100,heat_radius:10});const c=f[0]*f[1],n=new q({velocity:()=>[0,0],divergence:0,pressure:0,temperature:0},c);t=new H(e,n);const o={simulationInput:t,uniforms:s};S=new u(e,`${i} ${r} ${J}`,o,n.count,d),R=new u(e,`${i} ${r} ${ee}`,o,n.count,d),$=new u(e,`${i} ${r} ${Q}`,o,n.count,d),k=new u(e,`${i} ${r} ${ne}`,o,n.count,d),F=new u(e,`${i} ${r} ${te}`,o,n.count,d),P=new u(e,`${i} ${r} ${oe}`,o,n.count,d),I=new u(e,`${i} ${r} ${ie}`,o,n.count,d),D=new u(e,`${i} ${r} ${le}`,o,n.count,d),V=new u(e,`${i} ${r} ${ae}`,o,n.count,d);const g=new X(a,W.createPlaneVertices(2,2),1);z=new K(a,`${i} ${r} ${re}`,g,{simulation:t,uniforms:s}),window.addEventListener("mousemove",ue),window.addEventListener("mouseup",_e),window.addEventListener("mousedown",de),requestAnimationFrame(L);const E=document.getElementById("heatRadius"),O=document.getElementById("noiseStrength"),B=document.getElementById("fireTemp"),G=document.getElementById("heatRadiusValue"),M=document.getElementById("noiseStrengthValue"),U=document.getElementById("fireTempValue");E.addEventListener("input",m=>{const _=parseFloat(m.target.value);G.textContent=_,s.member.heat_radius=_}),O.addEventListener("input",m=>{const _=parseFloat(m.target.value);M.textContent=_,s.member.noise_strength=_}),B.addEventListener("input",m=>{const _=parseFloat(m.target.value);U.textContent=_,s.member.temp_injected=_})};pe();
