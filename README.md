## Params

Name               | Description
----               | -----------
project_type       | Type of project you are going to develop. You can use "web" or "node". If you use "web" gulp must use browserify, else only transforms ts to js
watch_dir          | Route to directory where gulp will look file changes
script_dest        | Route to directory that will contains the scripts file
style_dest         | Route to directory that will contains the CSS styles file
script_type        | Language you are going to use for script. "ts" and "js" are accepted.
script_source_file | Source file route and name.
script_bundle_name | Name for the bundle script file.
style_source_file  | Route and name to style source file
style_bundle_name  | Bundled styles file name
style_dest         | Route to directory to put the budled styles file