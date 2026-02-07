use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct TooltipPosition {
    top: f64,
    left: f64,
}

/// Computes a polygon clip-path string for the spotlight cutout overlay.
#[wasm_bindgen]
pub fn compute_clip_path(
    top: f64,
    left: f64,
    width: f64,
    height: f64,
    border_radius: f64,
) -> String {
    let right = left + width;
    let bottom = top + height;

    format!(
        "polygon(\
        0% 0%, \
        0% 100%, \
        {left}px 100%, \
        {left}px {tr}px, \
        {lr}px {top}px, \
        {rr}px {top}px, \
        {right}px {tr}px, \
        {right}px {br}px, \
        {rr}px {bottom}px, \
        {lr}px {bottom}px, \
        {left}px {bl}px, \
        {left}px 100%, \
        100% 100%, \
        100% 0%\
        )",
        left = left,
        top = top,
        right = right,
        bottom = bottom,
        tr = top + border_radius,
        lr = left + border_radius,
        rr = right - border_radius,
        br = bottom - border_radius,
        bl = bottom - border_radius,
    )
}

/// Computes optimal tooltip position relative to a target element.
/// Returns {top, left} as JsValue.
#[wasm_bindgen]
pub fn compute_tooltip_position(
    target_top: f64,
    target_left: f64,
    target_width: f64,
    target_height: f64,
    tooltip_width: f64,
    tooltip_height: f64,
    viewport_width: f64,
    viewport_height: f64,
    gap: f64,
    preferred_position: &str,
) -> Result<JsValue, JsValue> {
    let target_bottom = target_top + target_height;
    let target_right = target_left + target_width;

    let space_above = target_top;
    let space_below = viewport_height - target_bottom;
    let space_left = target_left;
    let space_right = viewport_width - target_right;

    let position = if preferred_position.is_empty() {
        if space_below >= tooltip_height + gap {
            "bottom"
        } else if space_above >= tooltip_height + gap {
            "top"
        } else if space_right >= tooltip_width + gap {
            "right"
        } else if space_left >= tooltip_width + gap {
            "left"
        } else {
            "bottom"
        }
    } else {
        preferred_position
    };

    let (mut top, mut left) = match position {
        "bottom" => (
            target_bottom + gap,
            target_left + (target_width / 2.0) - (tooltip_width / 2.0),
        ),
        "top" => (
            target_top - tooltip_height - gap,
            target_left + (target_width / 2.0) - (tooltip_width / 2.0),
        ),
        "left" => (
            target_top + (target_height / 2.0) - (tooltip_height / 2.0),
            target_left - tooltip_width - gap,
        ),
        "right" => (
            target_top + (target_height / 2.0) - (tooltip_height / 2.0),
            target_right + gap,
        ),
        _ => (
            target_bottom + gap,
            target_left + (target_width / 2.0) - (tooltip_width / 2.0),
        ),
    };

    // Clamp to viewport
    left = left.max(16.0).min(viewport_width - tooltip_width - 16.0);
    top = top.max(16.0).min(viewport_height - tooltip_height - 16.0);

    let result = TooltipPosition { top, left };
    serde_wasm_bindgen::to_value(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Generates confetti positions for celebration animation.
/// Returns an array of position percentages.
#[wasm_bindgen]
pub fn compute_confetti_positions(count: u32) -> Vec<f64> {
    let mut positions = Vec::with_capacity(count as usize);
    for i in 0..count {
        positions.push(((i as f64) * 17.0) % 100.0);
    }
    positions
}
