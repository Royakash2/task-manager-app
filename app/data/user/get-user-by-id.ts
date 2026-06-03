import db from "@/lib/db";
import { userRequired } from "./get-user";

export const getUserById = async () => {
  const { user } = await userRequired();
  const data = await db.user.findUnique({
    where: {
      id: user?.id,
    },
  });
  return data;
};
