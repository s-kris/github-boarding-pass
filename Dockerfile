FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Debug: Show current directory contents before build
RUN ls -la

RUN npm run build

# Debug: Show directory contents after build
RUN ls -la
RUN ls -la dist || echo "No dist directory"
RUN ls -la dist/server || echo "No dist/server directory"

EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321

# Add a healthcheck to verify the server is running
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

# Use a shell script to check the file exists before starting
CMD sh -c '[ -f "./dist/server/entry.mjs" ] && node ./dist/server/entry.mjs || (echo "entry.mjs not found" && ls -la ./dist/server/)' 