from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import Optional
import os
import uuid
import shutil

from app.database import get_db
from app.models import Photo
from app.schemas import PhotoResponse, PhotoUpdate

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=list[PhotoResponse])
async def list_photos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Photo).order_by(Photo.order_num, Photo.id))
    return result.scalars().all()


@router.post("", response_model=PhotoResponse)
async def upload_photo(
    file: UploadFile = File(...),
    caption: str = Form(""),
    date: str = Form(""),
    location: str = Form(""),
    is_last_photo: bool = Form(False),
    is_group_photo: bool = Form(False),
    db: AsyncSession = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    ext = os.path.splitext(file.filename or "image.jpg")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    result = await db.execute(select(Photo).order_by(Photo.order_num.desc()))
    max_order = result.scalars().first()
    order_num = (max_order.order_num + 1) if max_order else 0

    photo = Photo(
        url=f"/uploads/{filename}",
        caption=caption,
        date=date,
        location=location,
        is_last_photo=is_last_photo,
        is_group_photo=is_group_photo,
        order_num=order_num,
    )
    db.add(photo)
    await db.commit()
    await db.refresh(photo)
    return photo


@router.put("/{photo_id}", response_model=PhotoResponse)
async def update_photo(
    photo_id: int,
    data: PhotoUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Photo).where(Photo.id == photo_id))
    photo = result.scalar_one_or_none()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(photo, key, value)

    await db.commit()
    await db.refresh(photo)
    return photo


@router.delete("/{photo_id}")
async def delete_photo(photo_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Photo).where(Photo.id == photo_id))
    photo = result.scalar_one_or_none()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    if photo.url.startswith("/uploads/"):
        filepath = os.path.join(UPLOAD_DIR, photo.url.replace("/uploads/", ""))
        if os.path.exists(filepath):
            os.remove(filepath)

    await db.delete(photo)
    await db.commit()
    return {"detail": "Deleted"}
