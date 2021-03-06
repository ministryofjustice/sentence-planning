
{{/* vim: set filetype=mustache: */}}
{{/*
Configure Mod Security
*/}}
{{- define "modsecurity.args" }}
nginx.ingress.kubernetes.io/enable-modsecurity: "true"
nginx.ingress.kubernetes.io/modsecurity-snippet: |
    Include /etc/nginx/owasp-modsecurity-crs/nginx-modsecurity.conf
    SecRuleEngine On
    SecAuditEngine RelevantOnly
    SecAuditLog /var/log/nginx/error.log
    SecAuditLogType Serial
    SecRequestBodyLimit 104857600
    SecRuleUpdateActionById 949110 "t:none,deny,status:406"
    SecRuleUpdateActionById 959100 "t:none,deny,status:406"
    SecAction \
    "id:900000,\
        phase:1,\
        nolog,\
        pass,\
        t:none,\
        setvar:tx.paranoia_level=2"
{{- end -}}