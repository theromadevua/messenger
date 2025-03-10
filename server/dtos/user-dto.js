class UserDto {
    email;
    id;
    isActivated;
    role;
    avatarPath;
    description;
    name;
    savedFilms;
    savedSerials;
    

    constructor(model) {
        this.avatarPath = model.avatarPath;
        this.description = model.description;
        this.role = model.role;
        this.name = model.name;
        this.email = model.email;
        this.id = model._id;
        this.savedFilms = model.savedFilms;
        this.savedSerials = model.savedSerials;
        this.isActivated = model.isActivated;
    }
}

export default UserDto