# Keyboard Dojo Desktop App Build Process

This document outlines the build process for the Keyboard Dojo desktop application.

## Prerequisites

Before building the desktop application, ensure you have the following installed:

- **Node.js** (v18 or later)
- **Yarn** (v1.22 or later)
- **Rust** (stable channel)
- **Platform-specific dependencies**:
  - **Windows**: Microsoft Visual C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: GTK development libraries, WebKit2GTK, libappindicator, and other dependencies (see below)

### Linux Dependencies

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf
```

On Fedora:

```bash
sudo dnf install -y gtk3-devel webkit2gtk3-devel libappindicator-gtk3-devel librsvg2-devel patchelf
```

On Arch Linux:

```bash
sudo pacman -S gtk3 webkit2gtk libappindicator-gtk3 librsvg patchelf
```

## Development Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/keyboard-dojo/keyboard-dojo.git
cd keyboard-dojo
```

2. Install dependencies:

```bash
yarn install
```

3. Build the shared package:

```bash
yarn workspace @keyboard-dojo/shared build
```

## Development

To start the development server:

```bash
yarn workspace @keyboard-dojo/desktop tauri:dev
```

This will start the Vite development server and launch the Tauri application in development mode.

## Building for Production

To build the application for production:

```bash
# Build the shared package first
yarn workspace @keyboard-dojo/shared build

# Build the desktop app
yarn workspace @keyboard-dojo/desktop tauri:build
```

This will create platform-specific packages in the `desktop/src-tauri/target/release/bundle` directory:

- **Windows**: `.msi` installer in the `msi` directory
- **macOS**: `.dmg` file in the `dmg` directory and `.app` bundle in the `macos` directory
- **Linux**: `.deb` package in the `deb` directory and `.AppImage` in the `appimage` directory

## Customizing the Build

### Application Metadata

Application metadata is defined in `desktop/src-tauri/tauri.conf.json`. You can modify the following properties:

- `productName`: The name of the application
- `version`: The version of the application
- `identifier`: The unique identifier for the application (e.g., `com.keyboarddojo.desktop`)

### Icons

Application icons are stored in `desktop/src-tauri/icons/`. To update the icons, replace the existing files with your own icons of the same name and format.

### Window Configuration

Window properties are defined in the `windows` array in `desktop/src-tauri/tauri.conf.json`. You can modify properties such as:

- `width` and `height`: The initial window dimensions
- `resizable`: Whether the window can be resized
- `fullscreen`: Whether the window should start in fullscreen mode
- `decorations`: Whether to show window decorations (title bar, borders)

### Bundle Configuration

Bundle configuration is defined in the `bundle` object in `desktop/src-tauri/tauri.conf.json`. You can modify properties such as:

- `targets`: The target platforms to build for
- `publisher`: The publisher name
- `icon`: The paths to the application icons

## Code Signing

### Windows

To sign the Windows installer, you need a code signing certificate. Update the `windows` object in the `bundle` section of `desktop/src-tauri/tauri.conf.json`:

```json
"windows": {
  "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT",
  "digestAlgorithm": "sha256",
  "timestampUrl": "http://timestamp.digicert.com"
}
```

### macOS

To sign the macOS application, you need an Apple Developer certificate. Update the `macOS` object in the `bundle` section of `desktop/src-tauri/tauri.conf.json`:

```json
"macOS": {
  "frameworks": [],
  "minimumSystemVersion": "10.13",
  "exceptionDomain": "",
  "signingIdentity": "YOUR_SIGNING_IDENTITY",
  "entitlements": null
}
```

## Continuous Integration

The project includes GitHub Actions workflows for continuous integration:

- `.github/workflows/desktop-build.yml`: Builds and tests the desktop application on all platforms

To use the CI workflow:

1. Push your changes to a branch
2. Create a pull request
3. The CI workflow will automatically build and test the application
4. If all tests pass, the pull request can be merged

## Deployment

The project includes a deployment script for uploading the built packages to a release server:

- `desktop/scripts/deploy.js`: Uploads the built packages to an S3 bucket and creates a release metadata file

To deploy the application:

1. Build the application for all platforms
2. Set the required environment variables:
   - `AWS_ACCESS_KEY_ID`: AWS access key ID
   - `AWS_SECRET_ACCESS_KEY`: AWS secret access key
   - `S3_BUCKET`: S3 bucket name
   - `APP_VERSION`: Application version (optional, defaults to package.json version)
   - `RELEASE_CHANNEL`: Release channel (optional, defaults to "stable")
3. Run the deployment script:

```bash
node desktop/scripts/deploy.js
```

## Troubleshooting

### Build Errors

If you encounter build errors, try the following:

1. Clean the build directory:

```bash
yarn workspace @keyboard-dojo/desktop tauri clean
```

2. Rebuild the shared package:

```bash
yarn workspace @keyboard-dojo/shared build
```

3. Try building again:

```bash
yarn workspace @keyboard-dojo/desktop tauri:build
```

### Runtime Errors

If you encounter runtime errors:

1. Check the application logs:
   - **Windows**: `%APPDATA%\keyboard-dojo\logs`
   - **macOS**: `~/Library/Logs/keyboard-dojo`
   - **Linux**: `~/.config/keyboard-dojo/logs`

2. Enable debug mode by setting the `TAURI_DEBUG` environment variable:

```bash
# Windows
set TAURI_DEBUG=true
# macOS/Linux
export TAURI_DEBUG=true
```

Then run the application in development mode:

```bash
yarn workspace @keyboard-dojo/desktop tauri:dev
``` 