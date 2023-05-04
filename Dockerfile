# Base image
FROM node:18-alpine

# Create and set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install


# Expose port
EXPOSE 8000

# RUN npm run typeorm-generate-migrations

# RUN npm run typeorm-run-migrations


# Run migrations
CMD npm run start:dev