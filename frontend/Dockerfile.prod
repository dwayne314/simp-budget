# pull official base image
FROM node:13.12.0-alpine as builder

# set working directory
WORKDIR /app

# install app dependencies
COPY ./package*.json /app/

RUN npm install --silent
RUN npm install react-scripts@3.4.0 -g --silent

# copy and build app
COPY . /app
RUN npm run build

# Serve The app ubuild 
FROM nginx

# Copy the build to the nginx root directory
COPY --from=builder /app/build /usr/share/nginx/html

# Remove the default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d

# start nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
