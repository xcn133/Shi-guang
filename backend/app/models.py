from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    caption = Column(String, default="")
    date = Column(String, default="")
    location = Column(String, default="")
    is_last_photo = Column(Boolean, default=False)
    is_group_photo = Column(Boolean, default=False)
    order_num = Column(Integer, default=0)
