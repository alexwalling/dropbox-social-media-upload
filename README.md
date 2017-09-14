# Dropbox Social Media Upload

## How to Run
```
	node index.js
```

## Expected Image file upload
The files need to be uploaded in the following format:
``` 
	{name}-{number}.{file type}
```
## General idea for Dropbox file upload tracking
- Init folder cursor from https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder
- When webhook event occurs, call https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder/continue, using the old cursor, to see what's changed
- Using the path from the changed files download, https://dropbox.github.io/dropbox-api-v2-explorer/#files_download

## Endpoints used for dropbox:
- list_folder: https://rapidapi.com/package/Dropbox/functions/getFolderContents
- list_folder_continue: https://rapidapi.com/package/Dropbox/functions/paginateFolderContents
- Download: https://rapidapi.com/package/Dropbox/functions/downloadFile
- Webhook: https://rapidapi.com/package/Dropbox/functions/webhookEvent


