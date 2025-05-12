import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoriteKey = 'favorites';
  private favoritesSubject = new BehaviorSubject<Set<string>>(new Set());
  favorites$ = this.favoritesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFavorites();
    }
  }

  private loadFavorites() {
    const savedFavorites = localStorage.getItem(this.favoriteKey);
    if (savedFavorites) {
      this.favoritesSubject.next(new Set(JSON.parse(savedFavorites)));
    }
  }

  private saveFavorites(favorites: Set<string>) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.favoriteKey, JSON.stringify([...favorites]));
    }
  }

  toggleFavorite(productId: string) {
    const favorites = new Set(this.favoritesSubject.value);
    if (favorites.has(productId)) {
      favorites.delete(productId);
    } else {
      favorites.add(productId);
    }
    this.favoritesSubject.next(favorites);
    this.saveFavorites(favorites);
  }

  isFavorite(productId: string): boolean {
    return this.favoritesSubject.value.has(productId);
  }

  getFavorites(): string[] {
    return [...this.favoritesSubject.value];
  }
}
