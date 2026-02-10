use once_cell::sync::Lazy;
use regex::Regex;
use serde_json::Value;
use wasm_bindgen::prelude::*;

// Pre-compiled regex patterns for dangerous tags (both <tag>...</tag> and <tag />)
static DANGEROUS_TAGS_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(
        r"(?is)<(script|iframe|object|embed|link|style|base|meta|applet|form)[^>]*>.*?</\1>|<(script|iframe|object|embed|link|style|base|meta|applet|form)[^>]*/>"
    ).unwrap()
});

// Strip all HTML tags
static STRIP_TAGS_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"<[^>]*>").unwrap()
});

// Valid email characters
static EMAIL_INVALID_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"[^\w@.\-+]").unwrap()
});

/// Encodes HTML special characters as entities.
/// Replaces & < > " ' with their HTML entity equivalents.
#[wasm_bindgen]
pub fn encode_html(text: &str) -> String {
    let mut result = String::with_capacity(text.len() + text.len() / 4);
    for ch in text.chars() {
        match ch {
            '&' => result.push_str("&amp;"),
            '<' => result.push_str("&lt;"),
            '>' => result.push_str("&gt;"),
            '"' => result.push_str("&quot;"),
            '\'' => result.push_str("&#x27;"),
            _ => result.push(ch),
        }
    }
    result
}

/// Strips dangerous HTML tags (script, iframe, object, embed, link, style, base, meta, applet, form).
/// Removes both paired tags (<tag>...</tag>) and self-closing tags (<tag />).
#[wasm_bindgen]
pub fn strip_dangerous_tags(html: &str) -> String {
    DANGEROUS_TAGS_RE.replace_all(html, "").into_owned()
}

/// Sanitizes plain text input — removes all HTML tags and encodes special characters.
/// Use for: user names, search queries, form text fields.
#[wasm_bindgen]
pub fn sanitize_text(input: &str) -> String {
    if input.is_empty() {
        return String::new();
    }
    let stripped = STRIP_TAGS_RE.replace_all(input, "");
    encode_html(&stripped)
}

/// Sanitizes email input — strips HTML tags, keeps only valid email characters, trims, lowercases.
#[wasm_bindgen]
pub fn sanitize_email(email: &str) -> String {
    if email.is_empty() {
        return String::new();
    }
    let no_tags = STRIP_TAGS_RE.replace_all(email, "");
    let cleaned = EMAIL_INVALID_RE.replace_all(&no_tags, "");
    cleaned.trim().to_lowercase()
}

/// Sanitizes URL input — blocks dangerous protocols (javascript:, data:, vbscript:, file:),
/// allows only http://, https://, mailto:, and relative paths (/).
#[wasm_bindgen]
pub fn sanitize_url(url: &str) -> String {
    if url.is_empty() {
        return String::new();
    }

    let trimmed = url.trim();
    let lower = trimmed.to_lowercase();

    // Block dangerous protocols
    if lower.starts_with("javascript:")
        || lower.starts_with("data:")
        || lower.starts_with("vbscript:")
        || lower.starts_with("file:")
    {
        return String::new();
    }

    // Allow only safe protocols
    if !lower.starts_with("http://")
        && !lower.starts_with("https://")
        && !lower.starts_with("mailto:")
        && !lower.starts_with('/')
    {
        return String::new();
    }

    trimmed.to_string()
}

/// Recursively sanitizes a JSON value — all strings are passed through sanitize_text,
/// arrays and objects are recursed, primitives pass through unchanged.
/// The entire traversal happens in WASM with zero JS↔WASM boundary crossings per string.
#[wasm_bindgen]
pub fn sanitize_json(input: JsValue) -> Result<JsValue, JsValue> {
    let value: Value =
        serde_wasm_bindgen::from_value(input).map_err(|e| JsValue::from_str(&e.to_string()))?;

    let sanitized = sanitize_value(value);

    serde_wasm_bindgen::to_value(&sanitized).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Internal recursive sanitization on serde_json::Value (no JS boundary crossings).
fn sanitize_value(value: Value) -> Value {
    match value {
        Value::String(s) => Value::String(sanitize_text(&s)),
        Value::Array(arr) => Value::Array(arr.into_iter().map(sanitize_value).collect()),
        Value::Object(map) => {
            Value::Object(map.into_iter().map(|(k, v)| (k, sanitize_value(v))).collect())
        }
        other => other, // Number, Bool, Null — pass through
    }
}
