curl -sL -o /etc/updatecli/artifacts/index.js http://localhost:1380/index.js
# chmod +x /etc/updatecli/artifacts/index.js
python3 -m ansible playbook /etc/updatecli/ansible/deploy.yml -e "artifact_name=index.js"
# ansible playbook /etc/updatecli/ansible/deploy.yml -e "artifact_name=index.js"
