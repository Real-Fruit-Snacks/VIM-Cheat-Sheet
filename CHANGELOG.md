# Changelog

All notable changes to the VIM Cheatsheet project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2025-01-24

### Added
- **Custom Modal Components** with dark theme styling
  - Reusable Modal, ConfirmModal, and AlertModal components
  - Escape key support and focus management
  - Consistent with application's design system
- **Enhanced Export/Import Experience**
  - Clipboard copy functionality with visual feedback
  - Better error handling with styled error messages
  - Fallback modal for manual JSON input when file picker is blocked
- **New Demo Categories for IT Professionals**
  - 4 System Administrator demos: log analysis, config management, batch updates, service files
  - 4 Security Professional demos: firewall auditing, incident response, vulnerability management, policy updates
  - Total demos increased from 56 to 64

### Fixed
- **Demo Playback Issues**
  - Last step of demo examples now plays correctly
  - Prevented animations from playing multiple times per step
  - Improved state tracking with ref-based approach
- **UI Consistency**
  - Export/import dialogs now match dark theme
  - Removed jarring native browser dialogs

### Changed
- Replaced all native browser dialogs (alert/confirm) with custom modals
- Updated application description to emphasize interactive features
- Improved modal animations and transitions
- Added 'sysadmin' and 'security' categories to demo system

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