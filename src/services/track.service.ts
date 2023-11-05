import { DataSource, DataSourceOptions, Repository, ILike } from 'typeorm';
import { TrackEntity } from '../database/entities/track.entity';
import { Buffer } from 'buffer';

export class TrackService {
  private dataSource: DataSource;
  private dataSourceRepository: Repository<TrackEntity>;

  // spotify authentication using the client credentials flow
  private spotifyToken: String;
  private spotifyClientId: any; // from .env -- see contructor
  private spotifyClientSecret: any; // from .env -- see contructor
  private tracksDataSourceOptionsString: any; // from .env -- see contructor
  private tracksDataSourceOptions: DataSourceOptions;

  constructor(){
    // setup and initialize the datasource
    this.tracksDataSourceOptionsString = process.env.TracksDataSourceOptions;
    this.tracksDataSourceOptions = JSON.parse(this.tracksDataSourceOptionsString);
    this.dataSource = new DataSource(this.tracksDataSourceOptions);
    this.dataSource.initialize();
    // get the datasource repository
    this.dataSourceRepository = this.dataSource.getRepository(TrackEntity);

    // setup spotify client credentials -- stored in .env
    this.spotifyClientId = process.env.SpotifyClientId;
    this.spotifyClientSecret = process.env.SpotifyClientSecret;
  }

  public index = async () => {
    const tracks = await this.dataSource.manager.find(TrackEntity)
    return tracks;
  }

  public getByISRC = async (isrc: string) => {
    // check to see if the isrc in the database
    const tracks = await this.dataSourceRepository.find({
        where: {
            isrc: isrc
        }
    });

    // there is existing track, return what is in the DB
    if(tracks.length){
        return tracks;
    } else {
        return "Track not in DB for isrc '" + isrc + "', try POST /:isrc to create a track."
    }
  }

  public getByLikeArtistName = async (artist: string) => {
    // check to see if the isrc in the database
    const tracks = await this.dataSourceRepository.findBy({
        artistNameList: ILike("%"+ artist +"%")
    });

    // there is existing track, return what is in the DB
    if(tracks.length){
        return tracks;
    } else {
        return "Artist not found for '" + artist + "', try POST /:isrc to create a track."
    }
  }

  public create = async (isrc: string) => {
    // check to see if the isrc is already in the database
    const existingTrack = await this.dataSourceRepository.find({
        where: {
            isrc: isrc
        }
    });

    // there is already an existing track, so return what is in the DB
    if(existingTrack.length){
        return existingTrack;
    }

    // ## authenticate with spotify API and retreive the token
    // setup the token request
    // convert spotify clientID:clientSecret to base64
    const spotifyClientInfoBase64 = Buffer.from((this.spotifyClientId + ':' + this.spotifyClientSecret),'binary').toString('base64');
    const spotifyTokenRequest = new Request('https://accounts.spotify.com/api/token' ,{
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + spotifyClientInfoBase64,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "grant_type=client_credentials"
    });

    // execute the token request
    const spotifyTokenResponse = await fetch(spotifyTokenRequest)
    .then(response => response.json())
    .then(response => {
        this.spotifyToken = response.access_token;
    });

    // get full track info from spotify API
    // prepare the track request
    const spotifyTrackRequest = new Request('https://api.spotify.com/v1/search?q=isrc:' + isrc + '&type=track' ,{
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + this.spotifyToken,
        }
    });

    // execute the track request
    const spotifyTrackResponse = await fetch(spotifyTrackRequest)
    .then(response => response.json())
    .then(response => {
        return response;
    })

    // No tracks returned from Spotify, track does not exist
    if(spotifyTrackResponse.tracks.items.length == 0){
        return "Track not found in DB or in Spotify for isrc '" + isrc + "', try a different ISRC";
    }

    // find the most popular track
    const responseTracks = spotifyTrackResponse.tracks.items.sort((a:any,b:any) => a.popularity > b.popoularity);
    const popularTrack = responseTracks[0];

    // create the artist name list, it must be stored as a string
    const artistNameListString = JSON.stringify(popularTrack.artists.map((artist:any) => artist.name));

    const dbTrack = {
        isrc: isrc,
        imageURI: popularTrack.album.images[0].url,
        title: popularTrack.name,
        artistNameList: artistNameListString
    }
    
    // user manager function save in order to overwrite if it already exists
    const newTrack = await this.dataSource.manager.save(TrackEntity, dbTrack);
    return newTrack;
  } 

  // delete track by DB id
  public delete = async (id: number) => {
    const deletedTrack = await this.dataSource.manager.delete(TrackEntity, id);
    return deletedTrack;
  } 
}