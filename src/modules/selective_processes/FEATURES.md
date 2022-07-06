# Selective Process Module 

## Restfull Context [SelectiveProcess]

#### [Create]
 - [x] - Creating a SelectiveProcess
#### [Delete]
 - [x] - Deleting SelectiveProcessby id

#### [Get by Id]
 - [x] - Getting SelectiveProcessby id

#### [Get All]
- [x] - GetAll with no filters
- [x] - GetAll with start, max
- [x] - Get SelectiveProcess Paginated

#### [Update]
 - [x] - Updating SelectiveProcess


#### [My Selective Processes] - Created by Company
- Path -> '/selectiveprocesses/my_selective_processes'
- Verb -> Get

#### [My Selective Processes Subscribed] - Selective Process where i have subscribed
- Path -> '/selectiveprocesses/my_selective_processes_subscribed'
- Verb -> Get

#### [Subscribe in Selective Processes] 
- Path -> '/selectiveprocesses/subscribe'
- Verb -> Post

#### [Get Paginated]
- Path -> '/selectiveprocesses/paginated'
- Verb -> Get
- Query -> page, limit
