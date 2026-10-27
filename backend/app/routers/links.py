"""
Router operacji CRUD na odnośnikach z ochroną przed BOLA/IDOR (/api/links).

Cyberbezpieczeństwo:
- BOLA / IDOR (OWASP API Security Top 1:2023): W operacji usuwania sprawdzamy, czy
  obiekt należy do bieżącego użytkownika (link.owner_id == current_user.id).
- Izolacja danych w zapytaniach: GET filtruje wyniki po kluczu obcym (where owner_id == current_user.id).
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.link import Link
from app.schemas.link import LinkCreate, LinkResponse

router = APIRouter(prefix="/api/links", tags=["Links"])


# TODO (Zadanie 3): Zaimplementuj operacje CRUD z ochroną przed BOLA:
#
# 1. GET /api/links
#    - Wstrzyknij current_user: User = Depends(get_current_user) oraz db: Session = Depends(get_db)
#    - Wykonaj zapytanie: select(Link).where(Link.owner_id == current_user.id)
#    - Zwróć list[LinkResponse] ze statusem 200 OK
#
# 2. POST /api/links
#    - Przyjmij link_data: LinkCreate, current_user oraz db
#    - Utwórz instancję Link przypisując owner_id = current_user.id
#    - Zapisz w bazie (db.add, db.commit, db.refresh)
#    - Zwróć LinkResponse ze statusem 201 Created
#
# 3. DELETE /api/links/{link_id}
#    - Pobierz obiekt: link = db.get(Link, link_id)
#    - Jeśli brak obiektu: rzuć HTTPException(status_code=404, detail="Nie znaleziono odnośnika")
#    - 🛡️ Kluczowa obrona BOLA:
#      if link.owner_id != current_user.id:
#          raise HTTPException(
#              status_code=status.HTTP_403_FORBIDDEN,
#              detail="Brak uprawnień do tego zasobu (Naruszenie BOLA/IDOR)"
#          )
#    - Usuń obiekt (db.delete, db.commit)
#    - Zwróć Response(status_code=status.HTTP_204_NO_CONTENT)
