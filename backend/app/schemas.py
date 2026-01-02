from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class CowBase(BaseModel):
    cow_id: str
    notes: Optional[str] = None

class CowCreate(CowBase):
    pass

class Cow(CowBase):
    pass

class EventBase(BaseModel):
    cow_id: str
    event_type: str
    event_date: date
    meta: Optional[dict] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: str

class EventUpdate(BaseModel):
    event_date: Optional[date] = None
    event_type: Optional[str] = None
    meta: Optional[dict] = None

class Setting(BaseModel):
    key: str
    value: str

    class Config:
        from_attributes = True

