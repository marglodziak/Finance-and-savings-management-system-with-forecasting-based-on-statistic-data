export class ConnectedUser {
    connectedUsername: string;
    connectingEmail: string;
    isEditable: boolean;

    constructor(username: string, email: string) {
        this.connectedUsername = username;
        this.connectingEmail = email;
        this.isEditable = false;
    }
}