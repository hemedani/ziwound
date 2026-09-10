# Build Configuration Guide

## Build Scripts Overview

This project provides multiple build configurations optimized for different environments:

### 🚀 `pnpm build:server` (VPS/Production Server)
**Optimized for limited resources (2GB RAM VPS)**

```bash
pnpm build:server
```

**Features:**
- Memory limit: 2GB (`--max-old-space-size=2048`)
- Suppresses non-critical warnings (`--no-warnings`)
- Faster build with reduced memory footprint
- Skips strict type checking during build (handled separately)
- **Best for**: Docker builds, CI/CD pipelines, VPS deployments

### 💻 `pnpm build:local` (Local Development Machine)
**Full-featured build for development machines**

```bash
pnpm build:local
```

**Features:**
- Memory limit: 8GB (`--max-old-space-size=8192`)
- Full optimization and tree-shaking
- Comprehensive error reporting
- **Best for**: Local testing, staging builds, powerful machines

### ✅ `pnpm build:strict` (Pre-production/CI)
**Maximum validation with full checks**

```bash
pnpm build:strict
```

**Features:**
- Runs TypeScript type checking first
- Runs ESLint validation
- Then performs full build with 8GB memory
- **Best for**: Pre-production validation, CI/CD gates, code reviews

### 🔄 `pnpm build` (Default)
**Balanced build for general use**

```bash
pnpm build
```

**Features:**
- Memory limit: 4GB (`--max-old-space-size=4096`)
- Standard Next.js build process
- **Best for**: General purpose, fallback option

## TypeScript Configuration Optimizations

The `tsconfig.json` includes performance optimizations:

```json
{
  "compilerOptions": {
    "incremental": true,           // Faster subsequent builds
    "skipLibCheck": true,          // Skip type checking of declaration files
    "noEmit": true,                // Don't emit output (Next.js handles this)
    "moduleResolution": "bundler"  // Modern module resolution
  }
}
```

## Docker Build Optimization

The Dockerfile uses the `build:server` script for production builds:

```dockerfile
ENV NODE_OPTIONS='--max-old-space-size=2048 --no-warnings'
RUN pnpm build:server
```

This ensures:
- Minimal memory usage during container builds
- Faster build times on resource-constrained systems
- Production-ready standalone output

## Memory Management

### When to Adjust Memory Limits

**Increase memory if you see:**
- `FATAL ERROR: Ineffective mark-compacts near heap limit`
- Build failures with large datasets
- Out of memory errors during compilation

**Decrease memory if:**
- Running on limited VPS (< 4GB RAM)
- Multiple processes competing for memory
- Docker container memory limits are strict

### Environment Variable Override

You can override memory limits per-build:

```bash
# Temporary override for single build
NODE_OPTIONS='--max-old-space-size=6144' pnpm build

# Or use the appropriate script
pnpm build:server  # 2GB
pnpm build:local   # 8GB
```

## Build Performance Tips

### 1. Clean Build Cache
```bash
# Clear Next.js cache if experiencing build issues
rm -rf .next
pnpm build
```

### 2. Incremental Builds
The `incremental: true` flag in tsconfig.json enables faster subsequent builds by caching type information.

### 3. Parallel Processing
Next.js automatically uses available CPU cores. You can control this:

```bash
# Limit to specific number of threads
NEXT_WORKERS=4 pnpm build
```

### 4. Production Optimizations
The standalone output mode (`output: "standalone"`) in next.config.ts creates a minimal production bundle:

```bash
# After build, only these are needed:
.next/standalone/
.next/static/
public/
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build
  run: pnpm build:strict
  env:
    NODE_OPTIONS: '--max-old-space-size=4096'
```

### Docker Build
```bash
# Uses build:server automatically
docker build -t ziwound-front .
```

## Troubleshooting

### Build Too Slow
- Use `pnpm build:server` for faster builds
- Ensure `incremental: true` is set in tsconfig.json
- Clear `.next` cache periodically

### Type Errors During Build
- Run `pnpm type-check` separately to see all errors
- Use `pnpm build:strict` to catch issues early
- Check `tsconfig.json` exclude patterns

### Memory Issues
- Increase `--max-old-space-size` value
- Close other applications during build
- Use `build:server` on limited resources

## Recommended Workflow

1. **Development**: `pnpm dev` (fast refresh)
2. **Local Testing**: `pnpm build:local` (full optimization)
3. **Pre-commit**: `pnpm type-check && pnpm lint` (quick validation)
4. **Pre-deploy**: `pnpm build:strict` (comprehensive check)
5. **Production**: `pnpm build:server` (optimized for server)
