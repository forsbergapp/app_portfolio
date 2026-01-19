# Release information
		
Refactored solution to present changelog. Release information is saved as markdown in the release tag in the git repository

|Github												|App Portfolio                                                                  |
|:--------------------------------------------------|:------------------------------------------------------------------------------|
|Uses release metadata in UI outside git repository	|Uses annotated tags with syntax git tag -a [tag] -m '\n### [keyword]\n- Description'|
|Release information not distributed                |Release information distributed with the git repository and CI/CD workflow     |
|Displays tags cut off without markdown support    	|Renders full markdown from saved git tags description in the git respository 	|

|CHANGELOG											|App Portfolio                                                                  |
|:--------------------------------------------------|:------------------------------------------------------------------------------|
|Release info in separate file inside or outside the release|Release information inside each tag with the release|
|Renders from version controlled file               |Renders dynamically from git tags descriptions in the git repository           |
|Markdown                                           |Markdown|

## Changelog

@{CHANGELOG}