mod commands;
pub mod domain;

use commands::system::open_local_file_path;
use commands::system::pick_image_file_base64;
use commands::system::ping;
use commands::system::save_export_zip_base64;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            ping,
            pick_image_file_base64,
            save_export_zip_base64,
            open_local_file_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
