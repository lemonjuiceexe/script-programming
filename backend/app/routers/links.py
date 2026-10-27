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


@router.get("", response_model=list[LinkResponse], status_code=status.HTTP_200_OK)
def get_links(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[Link]:
    stmt = select(Link).where(Link.owner_id == current_user.id)
    return list(db.scalars(stmt).all())


@router.post("", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(
    link_data: LinkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Link:
    new_link = Link(
        title=link_data.title,
        url=str(link_data.url),
        owner_id=current_user.id
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_link(
    link_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    link = db.get(Link, link_id)
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nie znaleziono odnośnika"
        )
    if link.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brak uprawnień do tego zasobu (Naruszenie BOLA/IDOR)"
        )
    db.delete(link)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
