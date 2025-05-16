# build backend into /pb
FROM alpine:latest AS be_build
ARG PB_VERSION=0.28.1
RUN apk add --no-cache unzip ca-certificates
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# build frontend into /app
FROM alpine:latest AS fe_build
RUN apk add --no-cache nodejs npm
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm install
COPY . /app
RUN npm run build

# dev mode - install dev tools, files will be bind-mounted at /app
FROM alpine:latest AS devcontainer
RUN apk add --no-cache nodejs npm vim
COPY --from=be_build /pb /pb

# prod mode - copy files into the container
FROM alpine:latest AS prod
VOLUME /data
EXPOSE 8000
COPY --from=be_build /pb /pb
COPY --from=fe_build /app/dist /app/dist
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8000", "--publicDir=/app/dist", "--dir=/data"]
