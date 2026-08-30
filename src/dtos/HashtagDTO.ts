export default class HashtagDTO {
  id?: number;
  tag?: string;
  createdAt?: Date;

  constructor(hashtag: any) {
    if (hashtag) {
      this.id = hashtag.id;
      this.tag = hashtag.tag;
      this.createdAt = hashtag.created_at || hashtag.createdAt;
    }
  }
}
