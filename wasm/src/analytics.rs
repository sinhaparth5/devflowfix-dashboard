use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
struct TrendDataPoint {
    period: String,
    total: f64,
    resolved: f64,
    failed: f64,
}

#[derive(Serialize)]
struct TransformedTrends {
    dates: Vec<String>,
    total: Vec<f64>,
    resolved: Vec<f64>,
    failed: Vec<f64>,
}

#[derive(Serialize)]
struct TransformedBreakdown {
    labels: Vec<String>,
    values: Vec<f64>,
}

#[derive(Deserialize)]
struct MTTRData {
    average_seconds: f64,
    min_seconds: f64,
    max_seconds: f64,
    median_seconds: f64,
    p95_seconds: f64,
    sample_size: f64,
}

#[derive(Serialize)]
struct FormattedMTTR {
    average: String,
    min: String,
    max: String,
    median: String,
    p95: String,
    sample_size: f64,
}

/// Transforms TrendDataPoint[] into separate arrays for chart rendering.
#[wasm_bindgen]
pub fn transform_trends(data: JsValue) -> Result<JsValue, JsValue> {
    let points: Vec<TrendDataPoint> = serde_wasm_bindgen::from_value(data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let mut dates = Vec::with_capacity(points.len());
    let mut total = Vec::with_capacity(points.len());
    let mut resolved = Vec::with_capacity(points.len());
    let mut failed = Vec::with_capacity(points.len());

    for p in &points {
        dates.push(format_period_date(&p.period));
        total.push(p.total);
        resolved.push(p.resolved);
        failed.push(p.failed);
    }

    let result = TransformedTrends {
        dates,
        total,
        resolved,
        failed,
    };

    serde_wasm_bindgen::to_value(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Converts {key: number} breakdown data to {labels: [], values: []} for charts.
#[wasm_bindgen]
pub fn transform_breakdown(data: JsValue) -> Result<JsValue, JsValue> {
    let map: std::collections::HashMap<String, f64> = serde_wasm_bindgen::from_value(data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let mut labels = Vec::with_capacity(map.len());
    let mut values = Vec::with_capacity(map.len());

    for (key, value) in &map {
        // Capitalize first letter
        let mut chars = key.chars();
        let label = match chars.next() {
            Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
            None => String::new(),
        };
        labels.push(label);
        values.push(*value);
    }

    let result = TransformedBreakdown { labels, values };
    serde_wasm_bindgen::to_value(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Converts seconds to a human-readable duration string like "Xh Ym".
#[wasm_bindgen]
pub fn format_seconds_to_duration(seconds: f64) -> String {
    let total_minutes = (seconds / 60.0).floor() as u64;
    let hours = total_minutes / 60;
    let minutes = total_minutes % 60;

    if hours > 0 {
        format!("{}h {}m", hours, minutes)
    } else {
        format!("{}m", minutes)
    }
}

/// Formats all MTTR fields from seconds to readable durations.
#[wasm_bindgen]
pub fn format_mttr(data: JsValue) -> Result<JsValue, JsValue> {
    let mttr: MTTRData = serde_wasm_bindgen::from_value(data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let result = FormattedMTTR {
        average: format_seconds_to_duration(mttr.average_seconds),
        min: format_seconds_to_duration(mttr.min_seconds),
        max: format_seconds_to_duration(mttr.max_seconds),
        median: format_seconds_to_duration(mttr.median_seconds),
        p95: format_seconds_to_duration(mttr.p95_seconds),
        sample_size: mttr.sample_size,
    };

    serde_wasm_bindgen::to_value(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Formats a decimal ratio as a percentage string like "XX.X%".
#[wasm_bindgen]
pub fn format_percentage(value: f64) -> String {
    format!("{:.1}%", value * 100.0)
}

/// Formats an ISO date string's period into "Mon DD" format.
fn format_period_date(period: &str) -> String {
    // Parse YYYY-MM-DD or ISO datetime, extract month and day
    let parts: Vec<&str> = period.split('T').next().unwrap_or(period).split('-').collect();
    if parts.len() >= 3 {
        let month = match parts[1] {
            "01" => "Jan",
            "02" => "Feb",
            "03" => "Mar",
            "04" => "Apr",
            "05" => "May",
            "06" => "Jun",
            "07" => "Jul",
            "08" => "Aug",
            "09" => "Sep",
            "10" => "Oct",
            "11" => "Nov",
            "12" => "Dec",
            _ => "???",
        };
        let day = parts[2].trim_start_matches('0');
        format!("{} {}", month, day)
    } else {
        period.to_string()
    }
}
