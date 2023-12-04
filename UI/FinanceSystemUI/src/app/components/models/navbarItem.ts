export class NavbarItem {
    name: string;
    imagePath: string;
    routerLink: string;

    constructor(name: string, imagePath: string, routerLink: string) {
        this.name = name;
        this.imagePath = imagePath;
        this.routerLink = routerLink;
    }
}