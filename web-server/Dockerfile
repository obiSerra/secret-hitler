FROM node:20

# Copy the source code to the working directory
COPY ./src /home/app
WORKDIR /home/app

# Install the dependencies
RUN npm install

CMD [ "node", "server.js" ]

