
export default class Role {
  code: number;
  description: string;
  private static dictionary: Map<number, string>;

  constructor(code: number) {
    Role.dictionary = new Map();
    Role.dictionary
      .set(0, "VISITOR")
      .set(1, "USER")
      .set(2, "EMPLOYEE")
      .set(3, "MODERATOR")
      .set(4, "ADMINISTRATOR")

    this.code = code;
  }

  static RoleExists(code: number) {
    const role = Array.from(this.dictionary.keys()).find(key => key === code);
    return role === null || role === undefined ? false : true;
  }

  ToInt(): number {
    return Array.from(Role.dictionary.keys()).find(key => key === this.code)!;
  }

  ToString(): string {
    return Role.dictionary.get(this.code)!;
  }

  Equals(value: number): boolean {
    return this.code === value;
  }

  UpdateStatus(code: number): void {
    this.code = code;
  }

  public static Visitor: Role = new Role(0);
  public static User: Role = new Role(1);
  public static Employee: Role = new Role(2);
  public static Moderator: Role = new Role(3);
  public static Administrator: Role = new Role(4);
}