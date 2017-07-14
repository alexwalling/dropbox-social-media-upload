# Dropbox Social Media Upload
init get cursor from https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder
Then when webhook happens, call https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder/continue using the old cursor to see what's changed
Then, using the path from the changed files, https://dropbox.github.io/dropbox-api-v2-explorer/#files_download

## Endpoints used for dropbox:
list_folder: https://rapidapi.com/package/Dropbox/functions/getFolderContents
list_folder_continue: https://rapidapi.com/package/Dropbox/functions/paginateFolderContents
Download: https://rapidapi.com/package/Dropbox/functions/downloadFile
Webhook: https://rapidapi.com/package/Dropbox/functions/webhookEvent

## Endpoints used for Instagram
upload_file

## Endpoints used for Facebook
upload_file

## Endpoints used for Twitter
upload_file
