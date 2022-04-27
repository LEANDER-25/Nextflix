import { Request } from "express";
import { User, UserDocument } from "src/models/user/user.schema";

interface RequestWithUser extends Request {
    user: UserDocument;
}

export default RequestWithUser;