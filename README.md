
<h1 align="center"> Workflow of issues - Funmee Team </h1>

![](https://user-images.githubusercontent.com/11253874/47194897-79a78b80-d383-11e8-95f2-28de24d3226f.png)

## I. Preparing ##
- Create Todo.
- Convert Todo to Issues.
- Discuss and prepare the content of the issue.
 
## II. Processing ##
#### 1. Create new branch ####
- Name branch : ```i{issues_number}```
- Example: ```i1, i2```
#### 2. Coding<a name='2'>.
- _Attention_: Only handle problems that fall within the scope of the issue.
	
#### 3. Commit and Push: ####
- Commit : 
  - Message : ```message  #{issues_number}```
  - Content: Representation content must match with edited contents at [`(2)`](#2)
  - Example: ```fix bug #1```
- Push code.
  * _Attention_:
    + Recheck before push code 
      - [x] Run normally or not?
      - [x] Relate to other parts or not? 
    + Unrelated files are not commit or push.
    
#### 4. A Pull Request (PR) has been created ? ####
- Existed yet: Move to step [`(5)`](#5)
- Not existed yet: Create PR and move to step [`(5)`](#5)
  - The content of PR consists of 3 main parts
    - [x] Change
    - [x] Related issues
    - [x] Release notes
			
#### 5. Request Review<a name='5'>.
- Received feedback : Review content that be received feedback and back to step [`(2)`](#2)
- Approved (all member) : Move to step [`(III)`](#iii)
  
## III. VN-Testing<a name='iii'>.
- Test PR based Discussion:
  - Failed: Go back to step [`(II.2)`](#2)
  - Passed: Move to step [`(IV)`](#iv)
    
## IV. JP-Testing<a name='iv'>.
- Test PR based Discussion:
  + Failed: Go back to step [`(II.2)`](#2)
  + Passed: Move to step [`(V)`](#v)
    
## V. Ready For Release<a name='v'>.
- Waiting for Release.  

## VI. Releasing. ##
- Mark Label Version & Merge PR
- Release
  
## VI. Done<a name='vi'>.
- Close issues.
