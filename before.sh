#!/bin/bash
[ -e /home/ubuntu/kanban-board/node_modules ] && rm -r /home/ubuntu/kanban-board/node_modules
[ -e /home/ubuntu/kanban-board/README.md ] && rm /home/ubuntu/kanban-board/README.md
[ -e /home/ubuntu/kanban-board/buildspec.yml ] && rm /home/ubuntu/kanban-board/buildspec.yml
[ -e /home/ubuntu/kanban-board/index.js ] && rm  /home/ubuntu/kanban-board/index.js
[ -e /home/ubuntu/kanban-board/package.json ] && rm  /home/ubuntu/kanban-board/package.json
[ -e /home/ubuntu/kanban-board/apollo.config.js ] && rm  /home/ubuntu/kanban-board/apollo.config.js
[ -e /home/ubuntu/kanban-board/babel.config.js ] && rm  /home/ubuntu/kanban-board/babel.config.js
[ -e /home/ubuntu/kanban-board/dist ] && rm -r /home/ubuntu/kanban-board/dist
[ -e /home/ubuntu/kanban-board/public ] && rm -r /home/ubuntu/kanban-board/public
[ -e /home/ubuntu/kanban-board/src ] && rm -r /home/ubuntu/kanban-board/src