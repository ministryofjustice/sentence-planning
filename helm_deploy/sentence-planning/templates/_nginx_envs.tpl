{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "nginx.envs" }}
env:
  - name: PROXY_SERVICE_HOST
    value: '127.0.0.1'
  - name: PROXY_SERVICE_PORT
    value: '8081'
  - name: NAXSI_USE_DEFAULT_RULES
    value: 'FALSE'
  - name: ENABLE_UUID_PARAM
    value: 'FALSE'
  - name: HTTPS_REDIRECT
    value: 'FALSE'
  - name: ERROR_REDIRECT_CODES
    value: '501 502 503 504'