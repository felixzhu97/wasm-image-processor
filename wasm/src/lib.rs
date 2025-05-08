use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn brighten(data: &[u8], width: u32, height: u32, value: f32) -> Vec<u8> {
    let factor = value / 100.0;
    let mut result = vec![0; data.len()];
    
    for i in (0..data.len()).step_by(4) {
        result[i] = (data[i] as f32 * factor).min(255.0) as u8;     // R
        result[i + 1] = (data[i + 1] as f32 * factor).min(255.0) as u8; // G
        result[i + 2] = (data[i + 2] as f32 * factor).min(255.0) as u8; // B
        result[i + 3] = data[i + 3]; // A
    }
    
    result
}

#[wasm_bindgen]
pub fn contrast(data: &[u8], width: u32, height: u32, value: f32) -> Vec<u8> {
    let factor = (259.0 * (value + 255.0)) / (255.0 * (259.0 - value));
    let mut result = vec![0; data.len()];
    
    for i in (0..data.len()).step_by(4) {
        result[i] = ((factor * (data[i] as f32 - 128.0) + 128.0).min(255.0).max(0.0)) as u8;
        result[i + 1] = ((factor * (data[i + 1] as f32 - 128.0) + 128.0).min(255.0).max(0.0)) as u8;
        result[i + 2] = ((factor * (data[i + 2] as f32 - 128.0) + 128.0).min(255.0).max(0.0)) as u8;
        result[i + 3] = data[i + 3];
    }
    
    result
}

#[wasm_bindgen]
pub fn saturate(data: &[u8], width: u32, height: u32, value: f32) -> Vec<u8> {
    let factor = value / 100.0;
    let mut result = vec![0; data.len()];
    
    for i in (0..data.len()).step_by(4) {
        let avg = (data[i] as f32 + data[i + 1] as f32 + data[i + 2] as f32) / 3.0;
        
        result[i] = ((avg + (data[i] as f32 - avg) * factor).min(255.0).max(0.0)) as u8;
        result[i + 1] = ((avg + (data[i + 1] as f32 - avg) * factor).min(255.0).max(0.0)) as u8;
        result[i + 2] = ((avg + (data[i + 2] as f32 - avg) * factor).min(255.0).max(0.0)) as u8;
        result[i + 3] = data[i + 3];
    }
    
    result
}
