import { NextRequest, NextResponse } from 'next/server';
import { HTTP_STATUS } from '@/enums/enums';
import User from '@/models/users.model';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const referralCode = searchParams.get('referralCode');

    if (!referralCode) {
      return NextResponse.json({ error: 'Código de referencia no proporcionado' }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const referrer = await User.findOne({ referralCode });

    if (!referrer) {
      return NextResponse.json({ error: 'Código de referencia no válido' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({ referrerId: referrer._id });
  } catch (error) {
    return NextResponse.json({ error: 'Error al verificar el código de referencia' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}