FROM node:22-alpine
WORKDIR /app
# Copies everything but node_modules
COPY ./app .
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
