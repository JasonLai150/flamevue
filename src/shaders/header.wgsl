struct CellData {
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

@group(1) @binding(0) var<uniform> uniforms : Uniforms;