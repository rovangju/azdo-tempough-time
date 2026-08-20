# Privacy Policy

Effective date: August 20, 2026

This policy describes data handling by **Time Entry for Tempough**, an independent Azure DevOps extension published by ITNobody. The extension is not affiliated with, endorsed by, or sponsored by Tempough.

## Data the extension accesses

The extension accesses the current Azure DevOps work item's ID, title, type, and URL. It also processes the Tempough API URL and API token entered by the user, selected Tempough project and task identifiers, time-entry fields, and user-entered notes.

## How data is used and transmitted

The extension uses work-item data to add context to a time entry. When a user submits an entry, the extension sends the selected project and task, date, hours, billable status, and notes containing the work item ID, title, URL, and user-entered text directly from the user's browser to the configured Tempough API endpoint.

The API token is sent to that endpoint as a bearer token. Users should configure only a trusted Tempough API URL.

ITNobody does not operate an intermediary service for these requests and does not include publisher-operated analytics or telemetry in the extension.

## Storage

The Tempough API URL, API token, and last selected project and task are stored using Azure DevOps user-scoped Extension Data. This storage is not a dedicated secrets vault. The stored values are available to the extension for that Azure DevOps user.

Users can clear the connection and saved selection from the extension. Uninstalling the extension and retention of Azure DevOps Extension Data are also subject to Microsoft's Azure DevOps policies and behavior.

## Third parties

Microsoft processes data as the provider of Azure DevOps and Extension Data. Tempough processes data submitted to its API. Their respective terms and privacy policies apply independently.

## Data sale and advertising

ITNobody does not sell data processed by the extension or use it for advertising.

## Security

The extension uses HTTPS endpoints and sends the API token only to the configured API endpoint. No method of storage or transmission is guaranteed to be completely secure. Users are responsible for protecting their API token and revoking it if compromise is suspected.

## Changes and contact

This policy may be updated as the extension changes. The Marketplace listing will identify the durable support and privacy contact before the extension is made public.
