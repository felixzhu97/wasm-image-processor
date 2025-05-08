use wasm_bindgen::prelude::*;

/// 亮度调整（加法方式，value=100时不变，>100变亮，<100变暗）
#[wasm_bindgen]
pub fn brighten(data: &[u8], value: u32) -> Vec<u8> {
    let mut out = data.to_vec();
    let offset = value as i32 - 100;
    for i in (0..out.len()).step_by(4) {
        out[i] = (out[i] as i32 + offset).clamp(0, 255) as u8;
        out[i+1] = (out[i+1] as i32 + offset).clamp(0, 255) as u8;
        out[i+2] = (out[i+2] as i32 + offset).clamp(0, 255) as u8;
        // alpha 不变
    }
    out
}

/// 对比度调整（value=100时不变）
#[wasm_bindgen]
pub fn contrast(data: &[u8], value: u32) -> Vec<u8> {
    let mut out = data.to_vec();
    let v = value as f32;
    let factor = (259.0 * (v + 255.0)) / (255.0 * (259.0 - v));
    for i in (0..out.len()).step_by(4) {
        out[i] = (factor * (out[i] as f32 - 128.0) + 128.0).clamp(0.0, 255.0) as u8;
        out[i+1] = (factor * (out[i+1] as f32 - 128.0) + 128.0).clamp(0.0, 255.0) as u8;
        out[i+2] = (factor * (out[i+2] as f32 - 128.0) + 128.0).clamp(0.0, 255.0) as u8;
    }
    out
}

/// 饱和度调整（value=100时不变）
#[wasm_bindgen]
pub fn saturate(data: &[u8], value: u32) -> Vec<u8> {
    let mut out = data.to_vec();
    let factor = value as f32 / 100.0;
    for i in (0..out.len()).step_by(4) {
        let avg = (out[i] as f32 + out[i+1] as f32 + out[i+2] as f32) / 3.0;
        out[i] = (avg + (out[i] as f32 - avg) * factor).clamp(0.0, 255.0) as u8;
        out[i+1] = (avg + (out[i+1] as f32 - avg) * factor).clamp(0.0, 255.0) as u8;
        out[i+2] = (avg + (out[i+2] as f32 - avg) * factor).clamp(0.0, 255.0) as u8;
    }
    out
}