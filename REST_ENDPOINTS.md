# Endpoints REST
## Contexts
 - [x] Android
 - [x] Vue
 - [x] RestFull

## Android
 - Class -> LoginEndpoint, PingEndpoint, SaveOrUpdateEndpoint
 - Path Prefix -> '/login'
 - Path Prefix -> '/ping'
 - Path Prefix -> '/save'
### Routes

#### login firebase
 - Path -> '/login/firebaselogin'
 - Verb -> Post
- [x] - Migrated to mutation doLogin

#### ping test
 - Path -> '/ping/test'
 - Verb -> Post
 - [x] - Useless

#### [save] user
 - Path -> '/save/user'
 - Verb -> Post
- [x] - Migrated to mutation createUser
- [x] - Migrated to mutation updateUser

#### [save] candidate
- Path -> '/save/candidate'
- Verb -> Post
- [x] - Migrated to mutation createCandidate
- [x] - Migrated to mutation updateCandidate

#### [save] resume
- Path -> '/save/resume'
- Verb -> Post
- [x] - Migrated to mutation createResume
- [x] - Migrated to mutation updateResume

## Vue
 - Class -> VueEndpoint
 - Path Prefix -> '/vue'

### Routes

#### [Create] candidate
- Path -> '/vue/create_candidate'
- Verb -> Post
- [x] - Migrated to mutation createCandidate

#### [Create] company
- Path -> '/vue/create_company'
- Verb -> Post
- [x] - Migrated to mutation createCompany

#### [Update] company or candidate
- Path -> '/vue/update_by_token'
- Verb -> Put
- [x] - Migrated to mutation updateCandidate
- [x] - Migrated to mutation updateCompany

#### [Create or Update] resume
- Path -> '/vue/create_or_update_resume_by_token'
- Verb -> Post
- [x] - Migrated to mutation createResume
- [x] - Migrated to mutation updateResume

#### [Create or Update] job
- Path -> '/vue/create_or_update_job_by_token'
- Verb -> Post
- [x] - Migrated to mutation createJob
- [x] - Migrated to mutation updateJob

#### [Create or Update] selective process
- Path -> '/vue/create_or_update_sp_by_token'
- Verb -> Post
- [x] - Migrated to mutation createSelectiveProcess
- [x] - Migrated to mutation updateSelectiveProcess

#### [Validate] cpf
- Path -> '/vue/validate_cpf'
- Verb -> Post
- [] - Not Implemented Yet

## Restfull [Authentication]
- Class -> AuthEndpoint
- Path Prefix -> '/auth'

### Routes [Auth]

#### [Login]
- Path -> '/auth/login'
- Verb -> Post
- [x] - Migrated to mutation doLogin

#### [Me] - About Me
- Path -> '/auth/me'
- Verb -> Get
- [x] - Migrated to query aboutMe

## Restfull [Author]
- Class -> AuthorEndpoint
- Path Prefix -> '/authors'

#### [Create]
- Path -> '/authors'
- Verb -> Post
- [x] - Migrated to mutation createAuthor

#### [Delete]
- Path -> '/authors'
- Verb -> Delete
- [x] - Migrated to mutation deleteAuthor

#### [Get by Id]
- Path -> '/authors/<!id>'
- Verb -> Get
- [x] - Migrated to query getAuthorById

#### [Get All]
- Path -> '/authors'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allAuthors

#### [Update]
- Path -> '/authors/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateAuthor

## Restfull [Blog]
- Class -> BlogEndpoint
- Path Prefix -> '/blogs'

#### [Create]
- Path -> '/blogs'
- Verb -> Post
- [x] - Migrated to mutation createBlog

#### [Delete]
- Path -> '/blogs'
- Verb -> Delete
- [x] - Migrated to mutation deleteBlog

#### [Get by Id]
- Path -> '/blogs/<!id>'
- Verb -> Get
- [x] - Migrated to query getBlogById

#### [Get All]
- Path -> '/blogs'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allBlogs

#### [Update]
- Path -> '/blogs/<!id>'
- Verb -> Put
- [x] - Migrated to query updateBlog

#### [Get Categories]
- Path -> '/blogs/categories'
- Verb -> Get
- [] - Not Implemented Yet

#### [Get Time Periods] - Periods from Blogs Posts
- Path -> '/blogs/time_periods'
- Verb -> Get
- [] - Not Implemented Yet

#### [Get Recents]
- Path -> '/blogs/recents'
- Verb -> Get
- Query -> start,max
- [] - Not Implemented Yet

#### [Get Paginated]
- Path -> '/blogs/paginated'
- Verb -> Get
- Query -> page, limit
- [x] - Migrated to query allBlogsPaginated

## Restfull [Candidate]
- Class -> CandidateEndpoint
- Path Prefix -> '/candidates'

#### [Create]
- Path -> '/candidates'
- Verb -> Post
- [x] - Migrated to mutation createCandidate

#### [Delete]
- Path -> '/candidates'
- Verb -> Delete
- [x] - Migrated to mutation deleteCandidate

#### [Get by Id]
- Path -> '/candidates/<!id>'
- Verb -> Get
- [x] - Migrated to query getCandidateById

#### [Get All]
- Path -> '/candidates'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query getAllCandidates

#### [Update]
- Path -> '/candidates/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateCandidate

#### [Get short list] Reduced Fields
- Path -> '/candidates/short_list'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query getAllCandidates

#### [notify]
 - Path -> '/candidates/notify'
 - Verb -> Post
 - [] - Not Implemented Yet


## Restfull [Comment]
- Class -> CommentEndpoint
- Path Prefix -> '/comments'

#### [Create]
- Path -> '/comments'
- Verb -> Post
- [x] - Migrated to mutation createComments

#### [Delete]
- Path -> '/comments'
- Verb -> Delete
- [x] - Migrated to mutation deleteComments

#### [Get by Id]
- Path -> '/comments/<!id>'
- Verb -> Get
- [x] - Migrated to query getCommentById

#### [Get All]
- Path -> '/comments'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allComments

#### [Update]
- Path -> '/comments/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateComment

#### [Get Recents]
- Path -> '/comments/recents'
- Verb -> Get
- Query -> start,max
- [] - Not Implemented Yet

#### [Create Blog Comment]
- Path -> '/comments/blog'
- Verb -> Post
- [x] - Migrated to mutation createComment

## Restfull [Company]
- Class -> CompanyEndpoint
- Path Prefix -> '/companies'

#### [Create]
- Path -> '/companies'
- Verb -> Post
- [x] - Migrated to mutation createCompany

#### [Delete]
- Path -> '/companies'
- Verb -> Delete
- [x] - Migrated to mutation deleteCompany

#### [Get by Id]
- Path -> '/companies/<!id>'
- Verb -> Get
- [x] - Migrated to query getCompanyById

#### [Get All]
- Path -> '/companies'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allCompanies

#### [Update]
- Path -> '/companies/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateCompany

#### [Get Random Logos]
- Path -> '/companies/logos'
- Verb -> Get
- Query -> start,max
- [] - Not Implemented Yet

## Restfull [Form]
- Class -> FormEndpoint
- Path Prefix -> '/forms'

#### [Create]
- Path -> '/forms'
- Verb -> Post
- [x] - Migrated to mutation createForm

#### [Delete]
- Path -> '/forms'
- Verb -> Delete
- [x] - Migrated to mutation deleteForm

#### [Get by Id]
- Path -> '/forms/<!id>'
- Verb -> Get
- [x] - Migrated to query getFormById

#### [Get All]
- Path -> '/forms'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allForms

#### [Update]
- Path -> '/forms/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateForm

## Restfull [JAAS Role]
- Class -> JAASRoleEndpoint
- Path Prefix -> '/jaasroles'

#### [Create]
- Path -> '/jaasroles'
- Verb -> Post
- [x] - Migrated to mutation createJAASRole

#### [Delete]
- Path -> '/jaasroles'
- Verb -> Delete
- [x] - Migrated to mutation deleteJAASRole

#### [Get by Id]
- Path -> '/jaasroles/<!id>'
- Verb -> Get
- [x] - Migrated to query getJAASRoleByName

#### [Get All]
- Path -> '/jaasroles'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allJAASRoles

#### [Update]
- Path -> '/jaasroles/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateJAASRole

## Restfull [JAAS User]
- Class -> JAASUserEndpoint
- Path Prefix -> '/jaasusers'

#### [Create]
- Path -> '/jaasusers'
- Verb -> Post
- [x] - Migrated to mutation createJAASUser

#### [Delete]
- Path -> '/jaasusers'
- Verb -> Delete
- [x] - Migrated to mutation deleteJAASUser

#### [Get by Id]
- Path -> '/jaasusers/<!id>'
- Verb -> Get
- [x] - Migrated to query getJAASUserById

#### [Get All]
- Path -> '/jaasusers'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allJAASUsers

#### [Update]
- Path -> '/jaasusers/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateJAASUser

## Restfull [Job]
- Class -> JobEndpoint
- Path Prefix -> '/jobs'

#### [Create]
- Path -> '/jobs'
- Verb -> Post
- [x] - Migrated to mutation createJob

#### [Delete]
- Path -> '/jobs'
- Verb -> Delete
- [x] - Migrated to mutation deleteJob

#### [Get by Id]
- Path -> '/jobs/<!id>'
- Verb -> Get
- [x] - Migrated to query getJobById

#### [Get All]
- Path -> '/jobs'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allJobs

#### [Update]
- Path -> '/jobs/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateJob

#### [Get Feature]
- Path -> '/jobs/feature'
- Verb -> Get
- Query -> start,max
- [] - Not Implemented Yet

#### [Get Random Featured]
- Path -> '/jobs/random_featured'
- Verb -> Get
- [] - Not Implemented Yet

#### [Get by company id]
- Path -> '/jobs/company/<!id>'
- Verb -> Get
- [] - Not Implemented Yet

#### [Get Paginated]
- Path -> '/jobs/paginated'
- Verb -> Get
- Query -> page, limit
- [x] - Migrated to query allJobsPaginated

#### [Get My Jobs]
- Path -> '/jobs/my_jobs'
- Verb -> Get
- [] - Not Implemented Yet

#### [Subscribe Candidate in Job]
- Path -> '/jobs/subscribe'
- Verb -> Post
- [] - Not Implemented Yet

#### [Get by id and company id]
- Path -> '/jobs/<!id>/company/<!company_id>'
- Verb -> Get
- [] - Not Implemented Yet

## Restfull [Member]
- Class -> MemberEndpoint
- Path Prefix -> '/members'

#### [Create]
- Path -> '/members'
- Verb -> Post
- [x] - Migrated to mutation createMember

#### [Delete]
- Path -> '/members'
- Verb -> Delete
- [x] - Migrated to mutation deleteMember

#### [Get by Id]
- Path -> '/members/<!id>'
- Verb -> Get
- [x] - Migrated to query getMemberById

#### [Get All]
- Path -> '/members'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allMembers

#### [Update]
- Path -> '/members/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateMember

## Restfull [Resume]
- Class -> ResumeEndpoint
- Path Prefix -> '/resumes'

#### [Create]
- Path -> '/resumes'
- Verb -> Post
- [x] - Migrated to mutation createResume

#### [Delete]
- Path -> '/resumes'
- Verb -> Delete
- [x] - Migrated to mutation deleteResume

#### [Get by Id]
- Path -> '/resumes/<!id>'
- Verb -> Get
- [x] - Migrated to query getResumeById

#### [Get All]
- Path -> '/resumes'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allResumes

#### [Update]
- Path -> '/resumes/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateResume

#### [List with Candidates short]
- Path -> '/resumes/list_with_candidates_short'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allResumes

#### [List with Candidates short paginated]
- Path -> '/resumes/list_with_candidates_short_paginated'
- Verb -> Get
- Query -> page,limit
- [x] - Migrated to query allResumesPaginated


## Restfull [Selective Process]
- Class -> SelectiveProcessEndpoint
- Path Prefix -> '/selectiveprocesses'

#### [Create]
- Path -> '/selectiveprocesses'
- Verb -> Post
- [x] - Migrated to mutation createSelectiveProcess

#### [Delete]
- Path -> '/selectiveprocesses'
- Verb -> Delete
- [x] - Migrated to mutation deleteSelectiveProcess

#### [Get by Id]
- Path -> '/selectiveprocesses/<!id>'
- Verb -> Get
- [x] - Migrated to query getSelectiveProcessById

#### [Get All]
- Path -> '/selectiveprocesses'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allSelectiveProcesses

#### [Update]
- Path -> '/selectiveprocesses/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateSelectiveProcess

#### [My Selective Processes] - Created by Company
- Path -> '/selectiveprocesses/my_selective_processes'
- Verb -> Get
- [] - Not Implemented Yet

#### [My Selective Processes Subscribed] - Selective Process where i have subscribed
- Path -> '/selectiveprocesses/my_selective_processes_subscribed'
- Verb -> Get
- [] - Not Implemented Yet

#### [Subscribe in Selective Processes] 
- Path -> '/selectiveprocesses/subscribe'
- Verb -> Post
- [] - Not Implemented Yet

#### [Get Paginated]
- Path -> '/selectiveprocesses/paginated'
- Verb -> Get
- Query -> page, limit
- [x] - Migrated to query allSelectiveProcessesPaginated

## Restfull
- Class -> StatisticsEndpoint
- Path Prefix -> '/statistics'

#### [List Stats] - List Stats
- Path -> '/statistics'
- Verb -> Get
- [] - Not Implemented Yet


## Restfull [Subscriber]
- Class -> SubscriberEndpoint
- Path Prefix -> '/subscribers'

#### [Create]
- Path -> '/subscribers'
- Verb -> Post
- [x] - Migrated to mutation createSubscriber

#### [Delete]
- Path -> '/subscribers'
- Verb -> Delete
- [x] - Migrated to mutation deleteSubscriber

#### [Get by Id]
- Path -> '/subscribers/<!id>'
- Verb -> Get
- [x] - Migrated to query getSubscriberById

#### [Get All]
- Path -> '/subscribers'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allSubscribers

#### [Update]
- Path -> '/subscribers/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateSubscriber

#### [Subscribe] = Toggle
- Path -> '/subscribers/subscribe'
- Verb -> Post
- [] - Not Implemented Yet

## Restfull [Testimonial]
- Class -> TestimonialEndpoint
- Path Prefix -> '/testimonials'

#### [Create]
- Path -> '/testimonials'
- Verb -> Post
- [x] - Migrated to mutation createTestimonial

#### [Delete]
- Path -> '/testimonials'
- Verb -> Delete
- [x] - Migrated to mutation deleteTestimonial

#### [Get by Id]
- Path -> '/testimonials/<!id>'
- Verb -> Get
- [x] - Migrated to query getTestimonialById

#### [Get All]
- Path -> '/testimonials'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allTestimonials

#### [Update]
- Path -> '/testimonials/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateTestimonial


## Restfull [User]
- Class -> UserEndpoint
- Path Prefix -> '/users'

#### [Create]
- Path -> '/users'
- Verb -> Post
- [x] - Migrated to mutation createUser

#### [Delete]
- Path -> '/users'
- Verb -> Delete
- [x] - Migrated to mutation deleteUser

#### [Get by Id]
- Path -> '/users/<!id>'
- Verb -> Get
- [x] - Migrated to query getUserById

#### [Get All]
- Path -> '/users'
- Verb -> Get
- Query -> start,max
- [x] - Migrated to query allUsers

#### [Update]
- Path -> '/users/<!id>'
- Verb -> Put
- [x] - Migrated to mutation updateUser





