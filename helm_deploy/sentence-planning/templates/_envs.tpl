{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "sentence-planning.envs" }}
env:
  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: {{ template "sentence-planning.name" . }}
        key: APPINSIGHTS_INSTRUMENTATIONKEY
  - name: SENTENCEPLANNINGAPI_ENDPOINT_URL
    value: {{ .Values.env.SENTENCEPLANNING_API_URL | quote }}
  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

{{- end -}}
