from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas
from ..services import cow_service, event_service, setting_service
from ..database import get_db

router = APIRouter(prefix="/cows", tags=["cows"])

# Settings Endpoints
@router.get("/settings", response_model=dict)
def get_settings(db: Session = Depends(get_db)):
    return setting_service.get_all_settings(db)

@router.post("/settings")
def update_settings(settings: dict, db: Session = Depends(get_db)):
    definitions_updated = "event_definitions" in settings
    for key, value in settings.items():
        setting_service.update_setting(db, key, str(value))
    
    if definitions_updated:
        event_service.refresh_all_cow_events(db)
        
    return {"message": "Settings updated"}

@router.post("/", response_model=schemas.Cow)
def create_cow(cow: schemas.CowCreate, db: Session = Depends(get_db)):
    try:
        return cow_service.create_cow(db, cow)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/events/{event_id}", response_model=schemas.Event)
def update_event(event_id: str, event_update: schemas.EventUpdate, db: Session = Depends(get_db)):
    event = event_service.update_event(db, event_id, event_update)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/", response_model=List[schemas.Cow])
def get_cows(db: Session = Depends(get_db)):
    return cow_service.get_cows(db)

@router.get("/events/all", response_model=List[schemas.Event])
def get_all_events(db: Session = Depends(get_db)):
    return event_service.get_all_events(db)

@router.get("/{cow_id}", response_model=schemas.Cow)
def get_cow(cow_id: str, db: Session = Depends(get_db)):
    cow = cow_service.get_cow(db, cow_id)
    if not cow:
        raise HTTPException(status_code=404, detail="Cow not found")
    return cow

@router.delete("/{cow_id}")
def delete_cow(cow_id: str, db: Session = Depends(get_db)):
    success = cow_service.delete_cow(db, cow_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cow not found")
    return {"message": "Cow deleted successfully"}

@router.post("/{cow_id}/events", response_model=schemas.Event)
def add_event(cow_id: str, event: schemas.EventCreate, db: Session = Depends(get_db)):
    if cow_id != event.cow_id:
        raise HTTPException(status_code=400, detail="Cow ID in path must match body")
    
    if not cow_service.get_cow(db, cow_id):
        raise HTTPException(status_code=404, detail="Cow not found")
        
    return event_service.create_event(db, event)

@router.get("/{cow_id}/events", response_model=List[schemas.Event])
def get_cow_events(cow_id: str, db: Session = Depends(get_db)):
    if not cow_service.get_cow(db, cow_id):
        raise HTTPException(status_code=404, detail="Cow not found")
    return event_service.get_events_by_cow(db, cow_id)