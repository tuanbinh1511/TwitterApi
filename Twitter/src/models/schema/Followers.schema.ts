import { ObjectId } from 'mongodb'

interface FollowersSchema {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  followed_user_id: ObjectId
}

export default class Followers {
  _id?: ObjectId
  created_at?: Date
  user_id: ObjectId
  followed_user_id: ObjectId
  constructor({ _id, user_id, created_at, followed_user_id }: FollowersSchema) {
    this._id = _id
    this.created_at = created_at || new Date()
    this.user_id = user_id
    this.followed_user_id = followed_user_id
  }
}
