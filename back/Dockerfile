# Development stage
FROM denoland/deno:2.1.4 AS development

WORKDIR /app

# Copy dependency files first for better caching
COPY deno.json deno.lock ./

# Copy all source files
COPY . .

# Cache dependencies
RUN deno cache mod.ts

# Expose port
EXPOSE 1405

# Run with file watcher and all permissions
CMD ["deno", "task", "dev"]

# Production stage
FROM denoland/deno:2.1.4 AS production

WORKDIR /app

# Copy dependency files
COPY deno.json deno.lock ./

# Copy source files
COPY mod.ts deps.ts ./
COPY models/ ./models/
COPY src/ ./src/
COPY utils/ ./utils/

# Ensure uploads directory exists
RUN mkdir -p uploads

# Cache dependencies (won't re-run unless deps change)
RUN deno cache mod.ts

# Expose port
EXPOSE 1405

# Run without file watcher in production
CMD ["deno", "run", "--allow-all", "mod.ts"]
