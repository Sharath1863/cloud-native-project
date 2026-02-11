FROM nginx:alpine
# Remove the default config file
RUN rm /etc/nginx/conf.d/default.conf
# Copy your custom config into the conf.d directory
COPY nginx.conf /etc/nginx/conf.d/default.conf