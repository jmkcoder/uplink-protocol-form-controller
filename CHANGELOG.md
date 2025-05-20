# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.6] - 2025-05-19

### Added
- `ConfigManagerService` with comprehensive configuration management capabilities
- Dynamic step management with `addStepWithFormData` and `removeStepWithCleanup` methods
- Full form reset functionality with `updateConfigWithFullReset` method

### Changed
- Improved internal state management when dynamically modifying form structure
- Enhanced service coordination for configuration updates

## [0.2.5] - 2025-05-19

### Fixed
- Additional fixes for module resolution in browser environments
- Enhanced webpack configuration for better dependency bundling

## [0.2.4] - 2025-05-19

### Fixed
- Fixed module resolution for `@uplink-protocol/core` in browser environments
- Updated webpack configuration to properly bundle dependencies
- Resolved "Failed to resolve module specifier" error

## [0.2.3] - 2025-05-19

### Changed
- Updated to @uplink-protocol/core v0.0.9

## [0.2.2] - 2025-05-19

### Fixed
- Various bug fixes and performance improvements

## [0.2.1] - 2025-05-19

### Changed
- Migrated to @uplink-protocol/core for reactive bindings system
- Improved test suite organization

### Fixed
- Jest configuration for external dependencies
- Test compatibility with new binding system

## [0.2.0] - 2025-05-18

### Added
- Enhanced validation capabilities with multiple error collection
- Improved dynamic form modification with better step management
- Additional bindings for reactive form state tracking

### Changed
- Optimized form state updates for better performance
- Improved error message handling and customization
- Enhanced service architecture for better maintainability

### Fixed
- Various edge cases in multi-step form validation
- Issues with dynamic validator registration

## [0.1.1] - Initial Release

### Added
- Initial implementation of form controller
- Basic multi-step form support
- Field-level and form-level validation
- Reactive bindings system
