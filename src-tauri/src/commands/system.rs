use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use rfd::FileDialog;
use serde::Serialize;

#[derive(Serialize)]
pub struct PickedImageFilePayload {
    file_path: String,
    file_name: String,
    data_url: String,
}

fn resolve_image_mime(path: &Path) -> Result<&'static str, String> {
    let ext = path
        .extension()
        .and_then(|value| value.to_str())
        .map(|value| value.to_ascii_lowercase())
        .ok_or_else(|| format!("missing file extension: {}", path.to_string_lossy()))?;

    match ext.as_str() {
        "png" => Ok("image/png"),
        "jpg" | "jpeg" => Ok("image/jpeg"),
        "bmp" => Ok("image/bmp"),
        "gif" => Ok("image/gif"),
        "webp" => Ok("image/webp"),
        "svg" => Ok("image/svg+xml"),
        _ => Err(format!("unsupported image format: .{ext}")),
    }
}

#[tauri::command]
pub fn ping() -> &'static str {
    "pong"
}

#[tauri::command]
pub fn pick_image_file_base64() -> Result<Option<PickedImageFilePayload>, String> {
    let file_path = FileDialog::new()
        .add_filter(
            "Images",
            &["png", "jpg", "jpeg", "bmp", "gif", "webp", "svg"],
        )
        .pick_file();

    let Some(path) = file_path else {
        return Ok(None);
    };

    let file_name = path
        .file_name()
        .and_then(|value| value.to_str())
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
        .ok_or_else(|| format!("invalid file name: {}", path.to_string_lossy()))?;
    let mime = resolve_image_mime(&path)?;
    let bytes = fs::read(&path).map_err(|error| format!("read file failed: {error}"))?;
    let data_url = format!("data:{mime};base64,{}", STANDARD.encode(bytes));

    Ok(Some(PickedImageFilePayload {
        file_path: path.to_string_lossy().to_string(),
        file_name,
        data_url,
    }))
}

#[tauri::command]
pub fn save_export_zip_base64(
    dir_path: String,
    file_name: String,
    base64_data: String,
) -> Result<String, String> {
    let clean_name = file_name.trim();
    if clean_name.is_empty() {
        return Err("file_name is empty".to_string());
    }
    if clean_name.contains('\\') || clean_name.contains('/') {
        return Err("file_name must not contain path separators".to_string());
    }

    let output_dir = PathBuf::from(dir_path.trim());
    if output_dir.as_os_str().is_empty() {
        return Err("dir_path is empty".to_string());
    }

    fs::create_dir_all(&output_dir).map_err(|error| format!("create_dir_all failed: {error}"))?;
    let output_path = Path::new(&output_dir).join(clean_name);
    let bytes = STANDARD
        .decode(base64_data.trim())
        .map_err(|error| format!("base64 decode failed: {error}"))?;
    fs::write(&output_path, bytes).map_err(|error| format!("write file failed: {error}"))?;

    Ok(output_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn open_local_file_path(path: String) -> Result<(), String> {
    let target = path.trim();
    if target.is_empty() {
        return Err("path is empty".to_string());
    }

    let target_path = PathBuf::from(target);
    if !target_path.exists() {
        return Err(format!("path does not exist: {target}"));
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", target])
            .spawn()
            .map_err(|error| format!("failed to open path: {error}"))?;
        Ok(())
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(target)
            .spawn()
            .map_err(|error| format!("failed to open path: {error}"))?;
        Ok(())
    }

    #[cfg(all(not(target_os = "windows"), not(target_os = "macos")))]
    {
        Command::new("xdg-open")
            .arg(target)
            .spawn()
            .map_err(|error| format!("failed to open path: {error}"))?;
        Ok(())
    }
}
