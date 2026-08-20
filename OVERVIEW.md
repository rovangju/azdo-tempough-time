# Time Entry for Tempough

Create Tempough time entries without leaving an Azure DevOps work item. The extension adds the Tempough project code and work item ID and title to each entry so time records retain useful delivery context.

This is an independent integration published by ITNobody. It is not affiliated with, endorsed by, or sponsored by Tempough.

![Time-entry form in an Azure DevOps work item](docs/preview.png)

## Features

- Create a time entry from an Azure DevOps work item.
- Select active Tempough projects and their tasks.
- Include the date, hours, billable status, and optional notes.
- Add the Tempough project code and Azure DevOps work item ID and title to the entry notes.
- Remember the last project and task selection for each user.

## Requirements

- Azure DevOps Services
- A Tempough account and API token
- Browser access from Azure DevOps to the Tempough API

## Get started

1. Install the extension in your Azure DevOps organization.
2. Open an Azure Boards work item.
3. Expand **Log time to Tempough**.
4. Open **Connection settings**, enter the Tempough API URL and API token, and save the connection.
5. Choose a project and task, complete the time-entry fields, and select **Add entry**.

## Data and credentials

The extension reads the current work item's ID, title, and type. When you create an entry, its notes include the selected Tempough project code, work item ID and title, and any notes you enter.

Your API URL, API token, and last project and task selection are stored in Azure DevOps user-scoped Extension Data. This storage is not a dedicated secrets vault. The token is sent only to the configured Tempough API endpoint as a bearer token. The extension does not include publisher-operated analytics or telemetry.

See the included [privacy policy](PRIVACY.md) for details.

## Permissions

- **Work items (read):** reads context from the work item where the form is displayed.
- **Extension data (read and write):** stores each user's connection and last selection.

## Support

Public support through GitHub Issues will be available when the source repository is published. Until then, this extension is distributed privately to selected Azure DevOps organizations.

Tempough is a trademark of its respective owner. Use of the name identifies the service with which this independent extension interoperates.
