import { Injectable } from '@angular/core';
import { WebGLRenderer } from 'three';
@Injectable({
  providedIn: 'root'
})
export class RendererService {
  private readonly renderer: WebGLRenderer;

  constructor() {
    this.renderer = new WebGLRenderer();
    this.renderer.autoClear = false;
  }
  getRenderer(): WebGLRenderer {
    return this.renderer;
  }
}
