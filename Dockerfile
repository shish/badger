FROM node:18 AS build
#HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://127.0.0.1/ || exit 1
EXPOSE 3000

# Install dependencies
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm install

# Build app
COPY . /app
RUN npm run build

# Run app
CMD npm run preview
