# Overview

This is a boilerplate project for an Issue Tracker application built as part of the FreeCodeCamp Quality Assurance curriculum. The application is designed to manage project issues through a RESTful API, allowing users to create, read, update, and delete issues for different projects. The system includes both a web interface for interacting with issues and an API for programmatic access.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Express.js server with middleware for CORS, body parsing, and static file serving
- **API Design**: RESTful API with project-scoped issue management at `/api/issues/:project`
- **Route Structure**: Modular routing with separate files for API routes (`routes/api.js`) and FCC testing routes (`routes/fcctesting.js`)
- **HTTP Methods**: Support for GET (retrieve), POST (create), PUT (update), and DELETE operations on issues

## Frontend Architecture
- **Static Serving**: Express serves static HTML files from the `views` directory
- **UI Components**: Two main views - index page for API documentation and project-specific issue pages
- **Client-Side**: jQuery-based frontend for dynamic issue display and form submission
- **Styling**: Basic CSS with responsive design considerations

## Data Model
Based on the example API response, issues contain:
- Unique identifier (`_id`)
- Core fields: `issue_title`, `issue_text`, `created_by`
- Optional fields: `assigned_to`, `status_text`
- Timestamps: `created_on`, `updated_on`
- Status: `open` boolean flag

## Testing Framework
- **Testing Library**: Mocha with Chai for assertions and chai-http for HTTP testing
- **Test Structure**: TDD-style functional tests in `tests/2_functional-tests.js`
- **Test Runner**: Custom test runner (`test-runner.js`) with assertion analysis capabilities
- **Quality Assurance**: Built-in FCC testing integration for curriculum compliance

## Project Organization
- **Environment Configuration**: dotenv for environment variable management
- **Error Handling**: 404 middleware for unmatched routes
- **Development Tools**: Package.json configured with start and test scripts

# External Dependencies

## Core Dependencies
- **express**: Web application framework for Node.js
- **body-parser**: Middleware for parsing HTTP request bodies
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

## Testing Dependencies
- **mocha**: JavaScript testing framework
- **chai**: Assertion library for testing
- **chai-http**: HTTP integration testing for Chai

## Development Environment
- **Node.js**: Runtime environment
- **npm**: Package management
- **FreeCodeCamp Testing Suite**: Integrated testing for curriculum compliance

Note: The current implementation is a boilerplate with empty API route handlers that need to be implemented. No database integration is currently configured, but the architecture supports adding persistent storage solutions.