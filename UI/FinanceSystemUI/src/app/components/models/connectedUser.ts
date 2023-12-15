export class ConnectedUser {
    connectedUsername: string;
    isEditable: boolean;

    constructor(username: string) {
        this.connectedUsername = username;
        this.isEditable = false;
    }
}