# Create the base (that is node 18)
FROM node:18-alpine

# Create the workplace / folder
WORKDIR /app

# Copy the package of the used
COPY package*.json ./
RUN npm install

# Copy the whole project and Build it
COPY . .
RUN npm run build

# Send the port that the project use
EXPOSE 3000

# Start / Run the project
CMD ["npm" , "start"]