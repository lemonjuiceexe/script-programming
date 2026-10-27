"""
Schematy walidacji Pydantic v2 dla odnośników (Link).
"""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class LinkCreate(BaseModel):
    """
    Schemat danych wejściowych tworzenia odnośnika (Zadanie 1).
    """
    # TODO (Zadanie 1): Zdefiniuj pola wejściowe:
    # - title: str = Field(..., min_length=3, max_length=100, description="Nazwa odnośnika")
    # - url: HttpUrl = Field(..., description="Prawidłowy adres URI (wyłącznie schematy http/https)")
    pass


class LinkResponse(BaseModel):
    """
    Schemat danych wyjściowych odnośnika (Zadanie 1).
    """
    # TODO (Zadanie 1): Zdefiniuj pola wyjściowe:
    # - id: int
    # - title: str
    # - url: HttpUrl
    # - created_at: datetime
    # - owner_id: int
    #
    # Pamiętaj o konfiguracji ORM:
    # model_config = ConfigDict(from_attributes=True)
    pass
