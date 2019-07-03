import { Injectable } from '@angular/core';
import { WebGLRenderer } from "three";
@Injectable({
  providedIn: 'root'
})
export class RendererService {
  renderWidth: number;
  renderHeight: number;
  private rennderer: WebGLRenderer;

  constructor() {
    this.renderWidth = window.innerWidth;
    this.renderHeight = window.innerHeight;
    this.rennderer = new WebGLRenderer();
    this.rennderer.setSize(this.renderWidth, this.renderHeight);
    this.rennderer.autoClear = false;
  }
  getRenderer(): WebGLRenderer {
    return this.rennderer;
  }
}
