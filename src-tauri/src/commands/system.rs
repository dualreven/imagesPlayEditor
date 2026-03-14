use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use base64::engine::general_purpose::STANDARD;
use base64::Engine;

#[tauri::command]
pub fn ping() -> &'static str {
    "pong"
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
