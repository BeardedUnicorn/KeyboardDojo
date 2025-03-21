#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(debug_assertions)]
  let devtools = tauri_plugin_devtools::init(); // Initialize devtools early

  let mut builder = tauri::Builder::default();

  #[cfg(debug_assertions)]
  {
    builder = builder
      .plugin(devtools)
      .plugin(tauri_plugin_devtools_app::init());
  }

  builder
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
