# TABLES MIGRATED
 - [x] - Author
 - [x] - Author Medias
 - [x] - Blog
 - [x] - Comment
 - [x] - Blog Comments
 - [x] - Blog Pictures
 - [x] - Blog Tags 
 - [x] - Blog Categories 
 - [x] - Candidate
 - [x] - Company
 - [x] - Company Medias
 - [x] - Form
 - [x] - JAAS Role
 - [x] - JAAS Roles
 - [x] - JAAS User
 - [x] - Job
 - [x] - Job Candidates
 - [x] - Member
 - [x] - Member Medias
 - [x] - Resume
 - [x] - Resume Educations
 - [x] - Resume Experiences
 - [x] - Resume Skills
 - [x] - Selective Process
 - [x] - Selective Process Candidates
 - [x] - Subscriber
 - [x] - Testimonial
 - [x] - User

## Author Fields
  - [x] - id
  - [x] - created_at
  - [x] - updated_at
  - [x] - uuid
  - [x] - about_text
  - [x] - name
  - [x] - picture

## Author Medias
  - [x] - id -> references Author(id)
  - [x] - media
  - [x] - url

## Blog
  - [x] - id
  - [x] - created_at
  - [x] - updated_at
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
  - [x] - created_at
  - [x] - updated_at
  - [x] - uuid
  - [x] - email
  - [x] - name
  - [x] - text
  - [x] - parent_id

## Blog Comments
  - [x] - blog_id
  - [x] - comment_id

## Blog Pictures
  - [x] - id -> references Blog(id)
  - [x] - picture

## Blog Pictures
  - [x] - id -> references Blog(id)
  - [x] - name

## Blog Categories
  - [x] - id -> references Blog(id)
  - [x] - category

## Candidate
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - mobile_phone
 - [x] - city
 - [x] - state
 - [x] - neighborhood
 - [x] - number
 - [x] - street
 - [x] - zip_code
 - [x] - name
 - [x] - birth_date
 - [x] - cpf
 - [x] - user_id -> references User(id)

## Company
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - mobile_phone
 - [x] - city
 - [x] - state
 - [x] - neighborhood
 - [x] - number
 - [x] - street
 - [x] - zip_code
 - [x] - name
 - [x] - cnpj
 - [x] - description
 - [x] - logo
 - [x] - segment
 - [x] - user_id -> references User(id)

## Company Medias
  - [x] - id -> references Company(id)
  - [x] - media
  - [x] - url

## Form
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - email
 - [x] - message
 - [x] - name
 - [x] - subject

## JAAS Role
 - [x] - name

## JAAS Roles
 - [x] - id -> references User(id)
 - [x] - role_name -> references JAAS Role(name)

## JAAS User
 - [x] - id
 - [x] - login
 - [x] - password

## Job
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - activated
 - [x] - benefits
 - [x] - description
 - [x] - feature
 - [x] - job_category [enum]
 - [x] - job_type [enum]
 - [x] - max_payment
 - [x] - min_payment
 - [x] - requirement
 - [x] - title
 - [x] - company_id

## Job Candidates
 - [x] - job_id
 - [x] - candidate_id

## Member
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - name
 - [x] - occupation
 - [x] - picture
 - [x] - short_text

## Member
 - [x] - id -> references Member(id)
 - [x] - media
 - [x] - url

 ## Resume
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - carrer_level [enum]
 - [x] - content
 - [x] - objective
 - [x] - presence [enum]
 - [x] - candidate_id -> references Candidate(id)

 ## Resume Educations
 - [x] - id -> references Resume(id)
 - [x] - description
 - [x] - end_date
 - [x] - qualification
 - [x] - school_name
 - [x] - start_date

 ## Resume Experiences
 - [x] - id -> references Resume(id)
 - [x] - description
 - [x] - employer_name
 - [x] - end_date
 - [x] - jobTitle
 - [x] - start_date
 - [x] - responsibilities

 ## Resume Skills
 - [x] - id -> references Resume(id)
 - [x] - skill_name
 - [x] - months

 ## Selective Process
 - [x] - id
 - [x] - activated
 - [x] - created_at
 - [x] - disabled_at
 - [x] - expires_in
 - [x] - max_candidates
 - [x] - starts_in
 - [x] - updated_at
 - [x] - uuid
 - [x] - job_id

 ## Selective Process Candidates
 - [x] - sp_id -> references Selective Process(id)
 - [x] - candidate_id -> references Candidate(id)

## Subscriber
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - email

 ## Testimonial
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - picture
 - [x] - signature
 - [x] - text
 - [x] - author_id -> references Author(id)

## User
 - [x] - id
 - [x] - created_at
 - [x] - updated_at
 - [x] - uuid
 - [x] - activated
 - [x] - email
 - [x] - firebase_message_token
 - [x] - firebase_uuid






 





