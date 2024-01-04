export class NavbarItem {
    name: string;
    imagePath: string;
    routerLink: string;
    isActive: boolean;

    constructor(name: string, imagePath: string, routerLink: string, isActive: boolean = false) {
        this.name = name;
        this.imagePath = imagePath;
        this.routerLink = routerLink;
        this.isActive = isActive;
    }
}