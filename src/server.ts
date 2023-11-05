import express, {Request, Response} from 'express';
import { TrackController } from './controllers/track.controller'; // import the track controller
const dotenv = require('dotenv').config({path: './.env'}); // set up .env

class Server {
  private trackController: TrackController;
  private app: express.Application;
  
  constructor(){
    this.app = express(); // init the application
    this.configuration();
    this.routes();
  }

  /**
   * Method to configure the server,
   * If we didn't configure the port into the environment 
   * variables it takes the default port 3000
   */
  public configuration() {
    this.app.set('port', process.env.PORT || 3001);
    this.app.use(express.json());
  }

  /**
   * Method to configure the routes
   */
  public async routes(){
    this.trackController = new TrackController();

    this.app.get( "/", (req: Request, res: Response ) => {
      res.send( "Welcome to Evan Glover Coderapper Part 2" );
    });

    this.app.use(`/api/tracks/`, this.trackController.router); // routes of track controller
}

  /**
   * Used to start the server
   */
  public start(){
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is listening ${this.app.get('port')} port.`);
    });
  }
}

const server = new Server(); // Create server instance
server.start(); // Execute the server