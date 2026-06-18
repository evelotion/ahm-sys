import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ahm_sys_preset';

    if (!cloudName) {
      return NextResponse.json({ error: 'Env Cloudinary belum disetting di server' }, { status: 500 });
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );
    
    const data = await cloudinaryRes.json();

    if (data.secure_url) {
      return NextResponse.json({ success: true, url: data.secure_url });
    } else {
      return NextResponse.json({ error: 'Ditolak oleh Cloudinary', details: data }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan sistem di Backend' }, { status: 500 });
  }
}