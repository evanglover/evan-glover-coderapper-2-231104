import { Router, Response, Request } from "express";
import { TrackEntity } from "../database/entities/track.entity";
import { TrackService } from "../services/track.service"; // import service

export class TrackController {
  public router: Router;
  private trackService: TrackService; 

  constructor(){
    this.trackService = new TrackService(); // Create a new instance of TrackController
    this.router = Router();
    this.routes();
  }

  public index = async (req: Request, res: Response) => {
    const tracks = await this.trackService.index();
    res.send(tracks).json();
  } 

  public getByISRC = async (req: Request, res: Response) => {
    const isrc = req['params'].isrc as string;
    const tracks = await this.trackService.getByISRC(isrc);

    res.send(tracks).json();
  } 

  public getByLikeArtistName = async (req: Request, res: Response) => {
    const artist = req['params'].artist as string;
    const tracks = await this.trackService.getByLikeArtistName(artist);
    
    res.send(tracks).json();
  } 

  public create = async (req: Request, res: Response) => {
    const isrc = req['params'].isrc as string;
    const newTrack:any = await this.trackService.create(isrc)
    
    res.send(newTrack);    
  }

  public delete = async (req: Request, res: Response) => {
    const id =  req['params']['id'];
    res.send(this.trackService.delete(Number(id)));
  } 

  /**
   * Configure the routes of controller
   */
  public routes(){
    this.router.get('/', this.index);
    this.router.get('/isrc/:isrc', this.getByISRC);
    this.router.get('/artist/:artist', this.getByLikeArtistName);
    this.router.post('/:isrc', this.create);
    this.router.delete('/:id', this.delete);
  }
}