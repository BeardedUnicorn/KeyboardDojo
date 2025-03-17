# Keyboard Dojo Desktop App Deployment Guide

This guide outlines the process for deploying the Keyboard Dojo desktop application to end users.

## Overview

The Keyboard Dojo desktop application is distributed through multiple channels:

1. **Direct Download**: Users can download the application from the official website.
2. **GitHub Releases**: Users can download the application from the GitHub releases page.
3. **Auto-Updates**: Existing users can receive updates automatically through the built-in update mechanism.

## Release Process

### 1. Prepare for Release

Before creating a release, ensure that:

- All features for the release are complete and tested.
- All tests pass on all platforms.
- The version number is updated in `desktop/package.json`.
- The changelog is updated in `CHANGELOG.md`.

### 2. Create Release Builds

#### Manual Build Process

1. Build the application for all platforms:

```bash
# Build the shared package first
yarn workspace @keyboard-dojo/shared build

# Build the desktop app for all platforms
yarn workspace @keyboard-dojo/desktop tauri:build
```

2. Sign the packages (if applicable):

- **Windows**: Use a code signing certificate to sign the `.msi` installer.
- **macOS**: Use an Apple Developer certificate to sign the `.app` bundle and `.dmg` file.

#### Automated Build Process

Alternatively, use the GitHub Actions workflow to build the application:

1. Push your changes to the `main` branch or create a pull request.
2. The CI workflow will automatically build the application for all platforms.
3. For a release build, manually trigger the workflow with the "Create a release" option set to `true` and specify the version number.

### 3. Deploy to Release Server

#### Manual Deployment

1. Set up the required environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
export S3_BUCKET=releases.keyboarddojo.com
export APP_VERSION=1.0.0
export RELEASE_CHANNEL=stable
```

2. Run the deployment script:

```bash
node desktop/scripts/deploy.js
```

This will:
- Upload the built packages to the S3 bucket.
- Create a release metadata file.
- Update the "latest" metadata file for the auto-update mechanism.

#### Automated Deployment

The GitHub Actions workflow will automatically deploy the application to the release server if:
- The workflow is triggered by a push to the `main` branch.
- The workflow is manually triggered with the "Create a release" option set to `true`.

### 4. Create GitHub Release

#### Manual GitHub Release

1. Go to the [GitHub releases page](https://github.com/keyboard-dojo/keyboard-dojo/releases).
2. Click "Draft a new release".
3. Set the tag version (e.g., `v1.0.0`).
4. Set the release title (e.g., "Keyboard Dojo v1.0.0").
5. Add release notes, including a summary of changes and the full changelog.
6. Upload the built packages:
   - Windows: `.msi` installer
   - macOS: `.dmg` file
   - Linux: `.deb` package and `.AppImage`
7. Publish the release.

#### Automated GitHub Release

The GitHub Actions workflow will automatically create a draft GitHub release if the workflow is manually triggered with the "Create a release" option set to `true`.

### 5. Update Website

Update the download links on the official website to point to the new release:

1. Update the version number on the download page.
2. Update the direct download links to point to the new packages.
3. Update the changelog on the website.

## Auto-Update Server

The auto-update mechanism uses a simple server to provide update information to existing installations.

### Server Structure

The update server has the following structure:

```
releases.keyboarddojo.com/
├── stable/
│   ├── latest.json
│   ├── 1.0.0/
│   │   ├── release.json
│   │   ├── Keyboard-Dojo_1.0.0_x64.msi
│   │   ├── Keyboard-Dojo_1.0.0_x64.dmg
│   │   ├── keyboard-dojo_1.0.0_amd64.deb
│   │   └── Keyboard-Dojo-1.0.0.AppImage
│   └── ...
└── beta/
    ├── latest.json
    └── ...
```

### Update Metadata

The `latest.json` file contains information about the latest release:

```json
{
  "version": "1.0.0",
  "releaseDate": "2023-06-01T12:00:00Z",
  "channel": "stable",
  "platforms": {
    "windows": [
      {
        "url": "https://releases.keyboarddojo.com/stable/1.0.0/Keyboard-Dojo_1.0.0_x64.msi",
        "signature": "",
        "size": 12345678
      }
    ],
    "macos": [
      {
        "url": "https://releases.keyboarddojo.com/stable/1.0.0/Keyboard-Dojo_1.0.0_x64.dmg",
        "signature": "",
        "size": 12345678
      }
    ],
    "linux": [
      {
        "url": "https://releases.keyboarddojo.com/stable/1.0.0/keyboard-dojo_1.0.0_amd64.deb",
        "signature": "",
        "size": 12345678
      },
      {
        "url": "https://releases.keyboarddojo.com/stable/1.0.0/Keyboard-Dojo-1.0.0.AppImage",
        "signature": "",
        "size": 12345678
      }
    ]
  }
}
```

The `release.json` file in each version directory contains the same information as the `latest.json` file.

## Rollback Process

If issues are discovered after a release, you can roll back to a previous version:

1. Update the `latest.json` file to point to the previous version.
2. Update the download links on the website to point to the previous version.
3. Create a new release with a hotfix if necessary.

## Monitoring

Monitor the deployment to ensure that:

1. The packages are available for download.
2. The auto-update mechanism is working correctly.
3. Users are able to install and run the application.

Use the following tools for monitoring:

- **S3 Metrics**: Monitor download counts and bandwidth usage.
- **Application Telemetry**: Monitor application usage and error reports.
- **User Feedback**: Monitor user feedback through support channels.

## Troubleshooting

### Common Deployment Issues

#### Package Upload Failures

If package uploads fail:

1. Check your AWS credentials.
2. Check the S3 bucket permissions.
3. Try uploading the packages manually using the AWS CLI or S3 console.

#### Auto-Update Issues

If auto-updates are not working:

1. Check the `latest.json` file to ensure it's correctly formatted.
2. Check the URLs in the `latest.json` file to ensure they're accessible.
3. Check the application logs for update-related errors.

#### Installation Issues

If users are having trouble installing the application:

1. Check the packages to ensure they're correctly signed.
2. Check the installation logs for errors.
3. Test the installation process on a clean system.

## Security Considerations

### Code Signing

All packages should be signed with appropriate certificates:

- **Windows**: Use a code signing certificate from a trusted certificate authority.
- **macOS**: Use an Apple Developer certificate.
- **Linux**: Consider using GPG signatures for `.deb` packages and `.AppImage` files.

### Update Security

The auto-update mechanism should be secure:

1. Use HTTPS for all update URLs.
2. Consider adding signatures to update metadata.
3. Validate downloaded updates before installation.

## Compliance

Ensure that the deployment process complies with relevant regulations:

1. Include appropriate license information with the application.
2. Include privacy policy and terms of service documents.
3. Ensure that the application meets accessibility requirements.
4. Comply with data protection regulations (e.g., GDPR, CCPA). 