export const Role = {
    VISITOR: "VISITOR",
    USER: "USER",
    EMPLOYEE: "EMPLOYEE",
    MODERATOR: "MODERATOR",
    ADMINISTRATOR: "ADMINISTRATOR",
}

export type Role = keyof typeof Role;

export const ValidRole = (role: string) => Object.values(Role).find(value => value === role) || null;

export const RoleValues = Object.values(Role);


export const minimunRoleRequired = (role: Role, minimunRole: Role) => {
    return RoleValues.indexOf(role) >= RoleValues.indexOf(minimunRole);
}
