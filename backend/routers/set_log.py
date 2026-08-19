from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/set-log",
    tags=["Set-log"]
)

@router.get("/{set_log_id}", response_model=schemas.SetlogResponse)
def get_set_log(set_log_id: int, db: Session = Depends(get_db)):
    set_log = db.query(models.Set_log).filter(models.Set_log.id == set_log_id).first()
    if not set_log:
        raise HTTPException(status_code=404, detail="Set for this exercise not found")
    return set_log

@router.patch("/{set_log_id}", response_model=schemas.SetlogResponse)
def patch_set_log(
    set_log_id: int,
    updated_set: schemas.SetlogUpdate,
    db: Session = Depends(get_db),
):
    set_log = (
        db.query(models.Set_log)
        .filter(models.Set_log.id == set_log_id)
        .first()
    )

    if not set_log:
        raise HTTPException(status_code=404, detail="Set not found")

    set_log.reps = updated_set.reps
    set_log.weight = updated_set.weight

    db.commit()
    db.refresh(set_log)

    return set_log

@router.post("", response_model=schemas.SetlogResponse)
def create_set_log(set_log: schemas.SetlogCreate, db: Session = Depends(get_db)):
    new_set_log = models.Set_log(**set_log.dict())
    db.add(new_set_log)
    db.commit()
    db.refresh(new_set_log)
    return new_set_log

@router.delete("/{set_log_id}")
def delete_workout(set_log_id: int, db: Session = Depends(get_db)):
    set_log = db.query(models.Set_log).filter(models.Set_log.id == set_log_id).first()
    if not set_log:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(set_log)
    db.commit()
    return {"detail": "deleted"}

