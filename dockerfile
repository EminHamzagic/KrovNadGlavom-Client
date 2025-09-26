FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the app's code into the container
COPY . .

# Step 6: Expose the port your React app will run on
EXPOSE 3000

# Step 7: Start the React app
CMD ["npm", "dev"]
