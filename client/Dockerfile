# Build stage
FROM node:21.6.2-alpine as build

WORKDIR /client

COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.yarnpkg.com && \
    yarn install

COPY . .

RUN yarn build

# Serve stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /client/build /usr/share/nginx/html
COPY --from=build /client/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 to the host
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
