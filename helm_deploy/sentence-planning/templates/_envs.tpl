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
        name: sentence-planning
        key: API_CLIENT_ID
  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: sentence-planning
        key: API_CLIENT_SECRET
  - name: SESSION_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ template "sentence-planning.name" . }}
        key: SESSION_SECRET
  - name: NOMIS_AUTH_URL
    value: {{ .Values.env.NOMIS_AUTH_URL | quote }}
  - name: NOMIS_OAUTH_PUBLIC_KEY
    value: {{ .Values.env.NOMIS_OAUTH_PUBLIC_KEY | quote }}
  - name: ELITE2API_ENDPOINT_URL
    value: {{ .Values.env.ELITE2_API_URL | quote }}
  - name: SENTENCEPLANNINGAPI_ENDPOINT_URL
    value: {{ .Values.env.SENTENCEPLANNING_API_URL | quote }}
  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

{{- end -}}
