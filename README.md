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
	+ Chỉ xử lý các vấn đề trong phạm vi nội dung của Issues.
 #### 3. Commit and Push: ####
	+ Commit : 
		* Commit message : “message  #{issues_number}”
		* Message: Cần diễn tả khớp với các nội dung đã sửa ở (2)
		* Example: “message #1”
	+ Push code.
		* Attention : 
			+ Kiểm tra lại trước khi push code: 
				* Hoạt động bình thường
				* Không bị liên quan đến phần khác
			+ Unrelated files are not commit or push.
 #### 4. A Pull Request (PR) has been created ? ####
	+ PR exists: Move to step (5)
	+ Chưa tồn tại: Create PR and move to step (5)	
		Nội dung của PR gồm 3 phần chính
			* Change
			* Related issues
			* Release notes
 #### 5. Request Review. ####
	+ Dissmiss : Xem nội dung được feedback and back to step (1)
	+ Approved (all member) : Move to step (III)
  
## III. VN-Testing ##
	- Test PR based Discussion:
		+ Failed: Go back to step (II.1)
		+ Passed: Move to step (IV)
    
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
