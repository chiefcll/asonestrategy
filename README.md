# As One Strategy

Website for [As One Strategy](http://asonestrategy.com/), focused on leadership, business development, and faith-based strategy.

## Prerequisites

- **Hugo Extended**: Version 0.128.0 or later is recommended.
  - [Installation Guide](https://gohugo.io/installation/)
- **Dart Sass**: Required for style compilation if SCSS/SASS is used.
  - [Installation Guide](https://sass-lang.com/install)
- **Git**: For version control.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd asonestrategy
   ```

2. Initialize submodules (if any themes act as submodules):

   ```bash
   git submodule update --init --recursive
   ```

## Running Locally

To start the local development server with live reload:

```bash
hugo server
```

Once running, navigate to `http://localhost:1313` in your browser.

## Building for Production

To build the static site (generated files will be in the `public` directory):

```bash
hugo --minify
```

## Deployment

The site is configured to automatically deploy to **GitHub Pages** using GitHub Actions.

- **Workflow File**: `.github/workflows/hugo.yaml`
- **Trigger**: Pushes to the `main` branch.

### How it works

1. You make changes and commit them to the `main` branch.
2. GitHub Actions kicks off a build job.
3. Hugo builds the site using the `hugo` command.
4. The content of the `public` directory is uploaded and deployed to GitHub Pages.

## Configuration

Main configuration is handled in `hugo.toml`.

- **Base URL**: `http://asonestrategy.com/`
- **Title**: As One Strategy
