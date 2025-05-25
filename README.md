# Development

In dev-mode, the frontend will forward requests to `/api` to the backend, so you can visit the frontend and get all the hot-reloading goodness.

In prod-mode, the backend will serve static files from `/app/dist`, so that the frontend can be statically compiled and served by native code.

## Run backend

```
docker build .
docker run --rm -v $(pwd)/data:/data -p 3030:8000 -t $(docker build -q .)
```

## Frontend

- `npm install`
- `npm run dev`
