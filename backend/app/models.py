from sqlalchemy import Column, String, Date, JSON, ForeignKey
from .database import Base

class Cow(Base):
    __tablename__ = "cows"

    cow_id = Column(String, primary_key=True, index=True)
    notes = Column(String, nullable=True)

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    cow_id = Column(String, ForeignKey("cows.cow_id"))
    event_type = Column(String)
    event_date = Column(Date)
    meta = Column(JSON, nullable=True)

class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String) # Store as string, convert as needed
