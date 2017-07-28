# Dropbox Social Media Upload

## Expected Image file upload
The files need to be uploaded in the following format:
``` 
	{name}-{number}.{file type}
```
## General idea for Dropbox file upload tracking
init get cursor from https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder
Then when webhook happens, call https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder/continue using the old cursor to see what's changed
Then, using the path from the changed files, https://dropbox.github.io/dropbox-api-v2-explorer/#files_download

## Endpoints used for dropbox:
list_folder: https://rapidapi.com/package/Dropbox/functions/getFolderContents
list_folder_continue: https://rapidapi.com/package/Dropbox/functions/paginateFolderContents
Download: https://rapidapi.com/package/Dropbox/functions/downloadFile
Webhook: https://rapidapi.com/package/Dropbox/functions/webhookEvent


