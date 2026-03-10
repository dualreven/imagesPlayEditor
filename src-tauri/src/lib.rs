mod commands;
pub mod domain;

use commands::system::ping;
use commands::system::save_export_zip_base64;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ping, save_export_zip_base64])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
