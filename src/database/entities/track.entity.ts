import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tracks')
export class TrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isrc: string;
  
  @Column()
  imageURI: string;

  @Column()
  title: string;

  @Column()
  // Postgres does not allow Arrays, so this will be a JSON string
  artistNameList: string
}