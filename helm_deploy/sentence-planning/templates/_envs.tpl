{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "sentence-planning.envs" }}
env:
  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: sentence-planning
        key: API_CLIENT_ID
  - name: API_CLIENT_CREDENTIALS_SECRET
    valueFrom:
      secretKeyRef:
        name: sentence-planning
        key: API_CLIENT_SECRET
  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: {{ template "sentence-planning.name" . }}
        key: APPINSIGHTS_INSTRUMENTATIONKEY
  - name: OASYSAPI_ENDPOINT_URL
    value: {{ .Values.env.OASYSAPI_ENDPOINT_URL | quote }}
  - name: SENTENCEPLANNINGAPI_ENDPOINT_URL
    value: {{ .Values.env.SENTENCEPLANNING_API_URL | quote }}
  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

{{- end -}}
