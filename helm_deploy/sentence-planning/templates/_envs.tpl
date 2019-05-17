{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "sentence-planning.envs" }}
env:
  - name: DB_PASS
    valueFrom:
      secretKeyRef:
        name: sentence-planning-rds-instance-output
        key: database_password
  - name: DB_USER
    valueFrom:
      secretKeyRef:
        name: sentence-planning-rds-instance-output
        key: database_username
  - name: DB_SERVER
    valueFrom:
      secretKeyRef:
        name: sentence-planning-rds-instance-output
        key: rds_instance_address
  - name: DB_NAME
    valueFrom:
      secretKeyRef:
        name: sentence-planning-rds-instance-output
        key: database_name
  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: sentence-planning-secrets
        key: api_client_id
  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: sentence-planning-secrets
        key: api_client_secret
  - name: NOMIS_AUTH_URL
    value: {{ .Values.deploy.NOMIS_AUTH_URL | quote }}
  - name: NOMIS_OAUTH_PUBLIC_KEY
    value: {{ .Values.deploy.NOMIS_OAUTH_PUBLIC_KEY | quote }}

{{- end -}}
