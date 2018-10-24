![alt text](https://user-images.githubusercontent.com/11253874/47194897-79a78b80-d383-11e8-95f2-28de24d3226f.png)
# Work follow Funmee: #

## I. Preparing ##
- Create Todo.
- Convert Todo to Issues.
- Discuss and prepare the content of the issue.
 
## II. Processing ##
#### 1. Create new branch ####
- Name branch : i + issues_number
- Example: i1, i2 … 
#### 2. Coding<a name='2'>.
- _Attention_: Chỉ xử lý các vấn đề trong phạm vi nội dung của Issues.
#### 3. Commit and Push: ####
- Commit : 
  - Message : ```message  #{issues_number}```
  - Content: Cần diễn tả khớp với các nội dung đã sửa ở [`(2)`](#2)
  - Example: ```fix bug #1```
- Push code.
  * Attention:
    + Kiểm tra lại trước khi push code: 
      - [x] Hoạt động bình thường không ?
      - [x] Có bị liên quan đến phần khác không ? 
    + Unrelated files are not commit or push.
#### 4. A Pull Request (PR) has been created ? ####
- PR exists: Move to step [`(5)`](#5)
- Chưa tồn tại: Create PR and move to step [`(5)`](#5)
  - Nội dung của PR gồm 3 phần chính
    - [x] Change
    - [x] Related issues
    - [x] Release notes
			
#### 5. Request Review<a name='5'>.
- Dissmiss : Xem nội dung được feedback and back to step [`(2)`](#2)
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
