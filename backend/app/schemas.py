from pydantic import BaseModel
from typing import Optional


class PhotoCreate(BaseModel):
    caption: str = ""
    date: str = ""
    location: str = ""
    is_last_photo: bool = False
    is_group_photo: bool = False


class PhotoUpdate(BaseModel):
    caption: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    is_last_photo: Optional[bool] = None
    is_group_photo: Optional[bool] = None


class PhotoResponse(BaseModel):
    id: int
    url: str
    caption: str
    date: str
    location: str
    is_last_photo: bool
    is_group_photo: bool
    order_num: int

    class Config:
        from_attributes = True
