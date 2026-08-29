export default class MediaDTO {
  [key: string]: any;
    constructor(media){
        this.id = media.id        
        this.media = media.media
        this.url = media.url        
    }
}
