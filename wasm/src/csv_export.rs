use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
struct Incident {
    incident_id: String,
    source: String,
    severity: String,
    outcome: String,
    failure_type: String,
    created_at: String,
    resolved_at: Option<String>,
}

/// Builds a complete CSV string from an array of incidents with pre-allocated capacity.
#[wasm_bindgen]
pub fn build_incidents_csv(data: JsValue) -> Result<String, JsValue> {
    let incidents: Vec<Incident> = serde_wasm_bindgen::from_value(data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    // Pre-allocate: ~100 bytes per row estimate
    let mut csv = String::with_capacity(incidents.len() * 100 + 100);

    csv.push_str("Incident ID,Source,Severity,Status,Failure Type,Created At,Resolved At\n");

    for inc in &incidents {
        csv.push('"');
        csv.push_str(&inc.incident_id);
        csv.push_str("\",\"");
        csv.push_str(&inc.source);
        csv.push_str("\",\"");
        csv.push_str(&inc.severity);
        csv.push_str("\",\"");
        csv.push_str(&inc.outcome);
        csv.push_str("\",\"");
        csv.push_str(&inc.failure_type);
        csv.push_str("\",\"");
        csv.push_str(&inc.created_at);
        csv.push_str("\",\"");
        csv.push_str(inc.resolved_at.as_deref().unwrap_or("N/A"));
        csv.push_str("\"\n");
    }

    Ok(csv)
}

/// Computes the resolution time between two ISO date strings as "Xh Ym".
#[wasm_bindgen]
pub fn compute_resolution_time(created_at: &str, resolved_at: &str) -> String {
    if resolved_at.is_empty() || resolved_at == "null" {
        return "N/A".to_string();
    }

    // Parse ISO dates manually: extract time component for diff
    let created_ms = parse_iso_to_ms(created_at);
    let resolved_ms = parse_iso_to_ms(resolved_at);

    match (created_ms, resolved_ms) {
        (Some(c), Some(r)) => {
            let diff_ms = if r > c { r - c } else { 0 };
            let total_minutes = diff_ms / 60_000;
            let hours = total_minutes / 60;
            let minutes = total_minutes % 60;

            if hours > 0 {
                format!("{}h {}m", hours, minutes)
            } else {
                format!("{}m", minutes)
            }
        }
        _ => "N/A".to_string(),
    }
}

/// Computes visible page numbers for pagination.
#[wasm_bindgen]
pub fn compute_page_numbers(current_page: u32, total_pages: u32, max_pages_to_show: u32) -> Vec<u32> {
    if total_pages == 0 {
        return vec![];
    }

    let half = max_pages_to_show / 2;
    let mut start_page = if current_page > half {
        current_page - half
    } else {
        1
    };
    let end_page = (start_page + max_pages_to_show - 1).min(total_pages);

    if end_page - start_page < max_pages_to_show - 1 {
        start_page = if end_page >= max_pages_to_show {
            end_page - max_pages_to_show + 1
        } else {
            1
        };
    }

    (start_page..=end_page).collect()
}

/// Simple ISO 8601 date parser returning milliseconds since epoch.
fn parse_iso_to_ms(iso: &str) -> Option<u64> {
    // Expected format: YYYY-MM-DDTHH:MM:SS or YYYY-MM-DDTHH:MM:SS.sssZ
    let date_part = iso.split('T').next()?;
    let time_part = iso.split('T').nth(1).unwrap_or("00:00:00");

    let date_parts: Vec<&str> = date_part.split('-').collect();
    if date_parts.len() < 3 {
        return None;
    }

    let year: u64 = date_parts[0].parse().ok()?;
    let month: u64 = date_parts[1].parse().ok()?;
    let day: u64 = date_parts[2].parse().ok()?;

    // Strip timezone info and fractional seconds
    let clean_time = time_part
        .trim_end_matches('Z')
        .split('+')
        .next()
        .unwrap_or("00:00:00");
    let clean_time = clean_time.split('.').next().unwrap_or("00:00:00");

    let time_parts: Vec<&str> = clean_time.split(':').collect();
    let hour: u64 = time_parts.first().and_then(|s| s.parse().ok()).unwrap_or(0);
    let minute: u64 = time_parts.get(1).and_then(|s| s.parse().ok()).unwrap_or(0);
    let second: u64 = time_parts.get(2).and_then(|s| s.parse().ok()).unwrap_or(0);

    // Approximate days from epoch (good enough for diffs)
    let days = days_from_epoch(year, month, day);
    Some(((days * 86400 + hour * 3600 + minute * 60 + second) * 1000) as u64)
}

/// Calculates approximate days from Unix epoch for a given date.
fn days_from_epoch(year: u64, month: u64, day: u64) -> u64 {
    let y = if month <= 2 { year - 1 } else { year };
    let m = if month <= 2 { month + 9 } else { month - 3 };

    // Rata Die algorithm
    let days = 365 * y + y / 4 - y / 100 + y / 400 + (m * 306 + 5) / 10 + day - 1;
    // Subtract epoch offset (days from year 0 to 1970-01-01)
    days.saturating_sub(719_468)
}
