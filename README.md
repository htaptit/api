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
#### 2. Coding. ####
- _Attention_: Chỉ xử lý các vấn đề trong phạm vi nội dung của Issues.
#### 3. Commit and Push: ####
- Commit : 
  - Message : ```message  #{issues_number}```
  - Content: Cần diễn tả khớp với các nội dung đã sửa ở (2)
  - Example: ```fix bug #1```
- Push code.
  * Attention:
    + Kiểm tra lại trước khi push code: 
      - [x] Hoạt động bình thường không ?
      - [x] Có bị liên quan đến phần khác không ? 
    + Unrelated files are not commit or push.
#### 4. A Pull Request (PR) has been created ? ####
- PR exists: Move to step (5)
- Chưa tồn tại: Create PR and move to step [`(5)`](#ref-bottom-view)
  - Nội dung của PR gồm 3 phần chính
    - [x] Change
    - [x] Related issues
    - [x] Release notes
			
####  Request Review. <a name='ref-bottom-view'>.
- Dissmiss : Xem nội dung được feedback and back to step (1)
- Approved (all member) : Move to step (III)
  
## III. VN-Testing ##
- Test PR based Discussion:
  - Failed: Go back to step (II.1)
  - Passed: Move to step (IV)
    
## IV. JP-Testing ##
- Test PR based Discussion:
  + Failed: Go back to step (II.1)
  + Passed: Move to step (V)
    
## V. Ready For Release. ##
- Waiting for Release.  
## VI. Releasing. ##
- Mark Label Version & Merge PR
- Release
  
## VII. Done. ##
- Close issues.
