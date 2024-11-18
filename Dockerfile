FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the app
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

# Copy and use the custom start script
COPY start.mjs .

# Use tini as init system
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Start the server using the custom script
CMD ["node", "start.mjs"]