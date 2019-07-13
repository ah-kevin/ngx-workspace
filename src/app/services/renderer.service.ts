import { Injectable } from '@angular/core';
import { WebGLRenderer } from 'three';
@Injectable({
  providedIn: 'root'
})
export class RendererService {
  renderWidth: number;
  renderHeight: number;
  private readonly renderer: WebGLRenderer;

  constructor() {
    this.renderWidth = window.innerWidth;
    this.renderHeight = window.innerHeight;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.renderWidth, this.renderHeight);
    this.renderer.autoClear = false;
  }
  getRenderer(): WebGLRenderer {
    return this.renderer;
  }
}
