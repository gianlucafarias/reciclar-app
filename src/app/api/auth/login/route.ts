import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/database/db";
import { HTTP_STATUS } from "@/enums/enums";
import User from "@/models/users.model";
import { Error } from "@/types/ErrorTypes";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        // check if user exists in db
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "El usuario no existe", success: false }, { status: HTTP_STATUS.NOT_FOUND });
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: "Por favor verifique su cuenta antes de ingresar", success: false }, { status: HTTP_STATUS.UNAUTHORIZED });
        }

        // check if password is correct

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Contraseña incorrecta", success: false }, { status: HTTP_STATUS.UNAUTHORIZED });
        }
        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.NEXT_PUBLIC_JWT_TOKEN!, { expiresIn: "2y" });

        const response = NextResponse.json(
            {
                message: "Ingreso exitoso",
                success: true,
            },
            {
                status: HTTP_STATUS.OK,
            },
        );
        response.cookies.set("token", token, {
            maxAge: 60 * 60 * 24 * 365 * 2,
        });
        return response;
    } catch (error: unknown) {
        const Error = error as Error;
        return NextResponse.json({ error: Error.message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}
