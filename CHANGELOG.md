# Changelog

All notable changes to the VIM Cheatsheet project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2025-01-24

### Added
- **Service Worker** for comprehensive offline support
  - Automatic caching of all static assets on first visit
  - Smart caching strategies (network-first for HTML, cache-first for assets)
  - Offline fallback page for graceful degradation
  - Background update checks every hour
- **GitLab CI/CD Pipeline** (`.gitlab-ci.yml`)
  - Automated build and deployment to GitLab Pages
  - Type checking and linting in CI pipeline
  - Support for merge request preview builds
  - Optimized caching for faster builds
- **PWA Support** with Web App Manifest
  - Installable on desktop and mobile devices
  - Standalone display mode for app-like experience
  - Custom theme colors and icons
  - App shortcuts for quick access to Commands/Demos
- **Enhanced Offline Documentation**
  - All 16 VIM help files cached for offline access
  - Service Worker ensures help files are always available

### Changed
- Updated all icon and manifest paths to use absolute URLs with `/VIM/` base path
- Enhanced index.html with manifest link and theme color meta tag
- Improved build configuration for better offline compatibility

### Technical Details
- Service Worker implementation in `public/sw.js`
- Web App Manifest in `public/manifest.json`
- GitLab CI/CD configuration in `.gitlab-ci.yml`
- All assets now properly cached for offline use

## [3.7.0] - Previous Release

### Added
- Dynamic category switching between Commands and Demos views
- Context-aware sidebar categories based on current view
- Demo filtering by category (developer, writer, general)

### Changed
- Categories now dynamically update when switching between views
- Improved state management for view transitions

## [3.6.0] - Previous Release

### Fixed
- Complete revamp of demo playback system
- Last step in demos now displays for full duration
- Implemented state machine for reliable demo timing

## Previous Versions

See Git history for changes before v3.6.0