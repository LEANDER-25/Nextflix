import { Request } from "express";
import { User } from "src/models/user.schema";

interface RequestWithUser extends Request {
    user: User;
}

export default RequestWithUser;