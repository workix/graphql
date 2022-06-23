# TABLES MIGRATED
 - [x] - Author
 - [x] - Author Medias
 - [x] - Blog
 - [x] - Comment
 - [x] - Blog Comments
 - [x] - Blog Pictures
 - [x] - Blog Tags

## Author Fields
  - [x] - id
  - [x] - createdAt
  - [x] - updatedAt
  - [x] - uuid
  - [x] - aboutText
  - [x] - name
  - [x] - picture

## Author Medias
  - [x] - id -> references Author(id)
  - [x] - media
  - [x] - url

## Blog
  - [x] - id
  - [x] - createdAt
  - [x] - updatedAt
  - [x] - uuid
  - [x] - category
  - [x] - citation
  - [x] - content
  - [x] - date
  - [x] - resume
  - [x] - title
  - [x] - author_id -> references Author(id)

## Comment
  - [x] - id
  - [x] - createdAt
  - [x] - updatedAt
  - [x] - uuid
  - [x] - email
  - [x] - name
  - [x] - text

## Blog Comments
  - [x] - Blog_id
  - [x] - comments_id

## Blog Pictures
  - [x] - id -> references Blog(id)
  - [x] - pictures

## Blog Pictures
  - [x] - id -> references Blog(id)
  - [x] - name




