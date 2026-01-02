from sqlalchemy.orm import Session
from . import models, schemas
from datetime import timedelta
import uuid

import json

class SettingService:
    DEFAULT_SETTINGS = {
        "event_definitions": json.dumps([
            {"type": "pregnancy_check", "names": {"zh": "驗孕", "en": "Pregnancy Check", "ja": "妊娠鑑定"}, "days": 35},
            {"type": "dry_off", "names": {"zh": "乾乳", "en": "Dry Off", "ja": "乾乳"}, "days": 220},
            {"type": "expected_calving", "names": {"zh": "預產期", "en": "Expected Calving", "ja": "分娩予定"}, "days": 280},
            {"type": "calving", "names": {"zh": "分娩", "en": "Calving", "ja": "分娩"}, "days": 280},
            {"type": "weaning", "names": {"zh": "斷奶", "en": "Weaning", "ja": "離乳"}, "days": 360},
            {"type": "culling", "names": {"zh": "汰除", "en": "Culling", "ja": "淘汰"}, "days": 730}
        ])
    }

    def get_setting(self, db: Session, key: str) -> str:
        db_setting = db.query(models.Setting).filter(models.Setting.key == key).first()
        if db_setting:
            return db_setting.value
        return self.DEFAULT_SETTINGS.get(key, "")

    def update_setting(self, db: Session, key: str, value: str):
        db_setting = db.query(models.Setting).filter(models.Setting.key == key).first()
        if db_setting:
            db_setting.value = value
        else:
            db_setting = models.Setting(key=key, value=value)
            db.add(db_setting)
        db.commit()
        db.refresh(db_setting)
        return db_setting

    def get_all_settings(self, db: Session):
        settings = db.query(models.Setting).all()
        result = {**self.DEFAULT_SETTINGS}
        for s in settings:
            # Only use DB value if it's not None
            if s.value is not None:
                result[s.key] = s.value
        return result

class CowService:
    def create_cow(self, db: Session, cow: schemas.CowCreate):
        db_cow = db.query(models.Cow).filter(models.Cow.cow_id == cow.cow_id).first()
        if db_cow:
            raise ValueError(f"Cow with ID {cow.cow_id} already exists.")
        
        new_cow = models.Cow(cow_id=cow.cow_id, notes=cow.notes)
        db.add(new_cow)
        db.commit()
        db.refresh(new_cow)
        return new_cow

    def get_cow(self, db: Session, cow_id: str):
        return db.query(models.Cow).filter(models.Cow.cow_id == cow_id).first()

    def get_cows(self, db: Session):
        return db.query(models.Cow).all()

    def delete_cow(self, db: Session, cow_id: str):
        db_cow = db.query(models.Cow).filter(models.Cow.cow_id == cow_id).first()
        if not db_cow:
            return False
        
        db.query(models.Event).filter(models.Event.cow_id == cow_id).delete()
        
        db.delete(db_cow)
        db.commit()
        return True

class EventService:
    def _save_event(self, db: Session, event_data):
        cow_id = event_data["cow_id"] if isinstance(event_data, dict) else event_data.cow_id
        event_type = event_data["event_type"] if isinstance(event_data, dict) else event_data.event_type
        event_date = event_data["event_date"] if isinstance(event_data, dict) else event_data.event_date
        meta = event_data.get("meta") if isinstance(event_data, dict) else event_data.meta

        # For system_generated events, we might want to update instead of skip if they already exist
        is_system = meta and meta.get("source_event") == "system_generated"

        if is_system:
             existing = db.query(models.Event).filter(
                models.Event.cow_id == cow_id,
                models.Event.event_type == event_type,
                models.Event.meta.contains({"source_event": "system_generated"})
            ).first()
             if existing:
                 existing.event_date = event_date
                 existing.meta = meta
                 db.commit()
                 db.refresh(existing)
                 return existing

        existing = db.query(models.Event).filter(
            models.Event.cow_id == cow_id,
            models.Event.event_type == event_type,
            models.Event.event_date == event_date
        ).first()

        if existing:
            return existing

        event_id = str(uuid.uuid4())
        if isinstance(event_data, dict):
            new_event = models.Event(
                id=event_id,
                cow_id=event_data["cow_id"],
                event_type=event_data["event_type"],
                event_date=event_data["event_date"],
                meta=event_data.get("meta")
            )
        else:
            new_event = models.Event(
                id=event_id,
                cow_id=event_data.cow_id,
                event_type=event_data.event_type,
                event_date=event_data.event_date,
                meta=event_data.meta
            )
             
        db.add(new_event)
        db.commit()
        db.refresh(new_event)
        return new_event

    def create_event(self, db: Session, event: schemas.EventCreate):
        new_event = self._save_event(db, event)
        if event.event_type == 'insemination':
            self.generate_scheduled_events(db, event.cow_id, event.event_date)
        return new_event

    def update_event(self, db: Session, event_id: str, event_update: schemas.EventUpdate):
        db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
        if not db_event:
            return None
        
        update_data = event_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_event, key, value)
        
        db.commit()
        db.refresh(db_event)

        # If insemination date changed, regenerate/update other events
        if db_event.event_type == 'insemination' and 'event_date' in update_data:
            self.generate_scheduled_events(db, db_event.cow_id, db_event.event_date)

        return db_event

    def generate_scheduled_events(self, db: Session, cow_id: str, insemination_date):
        ss = SettingService()
        defs_json = ss.get_setting(db, "event_definitions")
        try:
            event_defs = json.loads(defs_json)
        except:
            event_defs = []

        # 1. Clear ALL existing system-generated events for this cow first
        existing_events = db.query(models.Event).filter(models.Event.cow_id == cow_id).all()
        for ev in existing_events:
            m = ev.meta
            if isinstance(m, str):
                try: m = json.loads(m)
                except: m = {}
            if m and m.get("source_event") == "system_generated":
                db.delete(ev)
        db.commit()

        # 2. Generate new events based on current definitions
        for d in event_defs:
            event_id = str(uuid.uuid4())
            new_event = models.Event(
                id=event_id,
                cow_id=cow_id,
                event_type=d['type'],
                event_date=insemination_date + timedelta(days=int(d['days'])),
                meta={
                    "source_event": "system_generated", 
                    "descriptions": d.get('names', {}),
                    "days_offset": d['days']
                }
            )
            db.add(new_event)
        
        db.commit()

    def refresh_all_cow_events(self, db: Session):
        # Find all cows with insemination events
        inseminations = db.query(models.Event).filter(models.Event.event_type == 'insemination').all()
        for ins in inseminations:
            self.generate_scheduled_events(db, ins.cow_id, ins.event_date)

    def get_events_by_cow(self, db: Session, cow_id: str):
        return db.query(models.Event).filter(models.Event.cow_id == cow_id).order_by(models.Event.event_date).all()

    def get_all_events(self, db: Session):
        return db.query(models.Event).order_by(models.Event.event_date).all()

cow_service = CowService()
event_service = EventService()
setting_service = SettingService()
