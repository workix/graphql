# TABLES MIGRATED
 - [x] - Author
 - [x] - Author Medias
 - [x] - Blog
 - [x] - Comment
 - [x] - Blog Comments
 - [x] - Blog Pictures
 - [x] - Blog Tags
 - [x] - User
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

## User
 - [x] - id
 - [x] - createdAt
 - [x] - updatedAt
 - [x] - uuid
 - [x] - active
 - [x] - email
 - [x] - firebaseMessageToken
 - [x] - firebaseUUID

## Candidate
 - [x] - id
 - [x] - createdAt
 - [x] - updatedAt
 - [x] - uuid
 - [x] - mobilePhone
 - [x] - city
 - [x] - estate
 - [x] - neighborhood
 - [x] - number
 - [x] - street
 - [x] - zipCode
 - [x] - name
 - [x] - birthDate
 - [x] - cpf
 - [x] - user_id -> references User(id)

## Company
 - [x] - id
 - [x] - createdAt
 - [x] - updatedAt
 - [x] - uuid
 - [x] - mobilePhone
 - [x] - city
 - [x] - estate
 - [x] - neighborhood
 - [x] - number
 - [x] - street
 - [x] - zipCode
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
 - [x] - createdAt
 - [x] - updatedAt
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
 - [x] - createdAt
 - [x] - updatedAt
 - [x] - uuid
 - [x] - active
 - [x] - benefits
 - [x] - description
 - [x] - feature
 - [x] - jobCategory
 - [x] - jobType
 - [x] - maxPayment
 - [x] - minPayment
 - [x] - requirement
 - [x] - title
 - [x] - company_id

## Job Candidates
 - [x] - Job_id
 - [x] - candidates_id

## Member
 - [x] - id
 - [x] - createdAt
 - [x] - updatedAt
 - [x] - uuid
 - [x] - name
 - [x] - occupation
 - [x] - picture
 - [x] - shortText

## Member
 - [x] - id -> references Member(id)
 - [x] - media
 - [x] - url

 ## Resume
 - [x] - id
 - [x] - createdAt
 - [x] - updatedAt
 - [x] - uuid
 - [x] - carrerLevel [enum]
 - [x] - content
 - [x] - objective
 - [x] - presence [enum]
 - [x] - candidate_id -> references Candidate(id)

 ## Resume Educations
 - [x] - id -> references Resume(id)
 - [x] - description
 - [x] - endDate
 - [x] - qualification
 - [x] - schoolName
 - [x] - startDate

 ## Resume Experiences
 - [x] - id -> references Resume(id)
 - [x] - description
 - [x] - employerName
 - [x] - endDate
 - [x] - jobTitle
 - [x] - startDate
 - [x] - responsibilities

 ## Resume Skills
 - [x] - id -> references Resume(id)
 - [x] - skillName
 - [x] - months

 ## Selective Process
 - [x] - id
 - [x] - active
 - [x] - createdAt
 - [x] - disabledAt
 - [x] - expire
 - [x] - maxCandidates
 - [x] - start
 - [x] - updatedAt
 - [x] - uuid
 - [x] - job_id

 ## Selective Process Candidates
 - [x] - sp_id -> references Selective Process(id)
 - [x] - candidate -> references Candidate(id)





 





