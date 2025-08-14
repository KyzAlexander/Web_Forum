interface Credentials {
  username: string;
  password: string;
}

export const authorizationAdmin: Credentials = {
  username: "admin",
  password: "admin",
};

export const authorizationUser: Credentials = {
  username: "user",
  password: "user",
};

export const usersPasswords: Record<number, string> = {
  1: "p1",
  2: "p2",
  3: "p3",
  4: "p4",
  5: "p5",
  6: "p6",
  7: "p7",
  8: "p8",
  9: "p9",
  10: "p10",
};
