import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RendererService } from 'src/app/services/renderer.service';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  GridHelper,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  OrthographicCamera,
  MeshBasicMaterial, PlaneGeometry, Vector3, Box2, Vector2, TorusGeometry
} from 'three';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.less']
})
export class StageComponent implements OnInit, AfterViewInit {
  renderer: WebGLRenderer;
  @ViewChild('container', {static: false}) container: ElementRef;
  scene: Scene;
  private camera: PerspectiveCamera;
  private geometry: BoxGeometry | TorusGeometry;
  private material: MeshNormalMaterial;
  private mesh: Mesh;
  private scene2: Scene;
  private camera2: OrthographicCamera;
  private overlayBox: Mesh;
  startTime = new Date().getTime();

  constructor(private renderSrv: RendererService) {
    this.renderer = this.renderSrv.getRenderer();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.container.nativeElement.appendChild(this.renderer.domElement);
    this.init();
    // this.animate();
  }

  init() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(50, this.renderSrv.renderWidth / this.renderSrv.renderHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 10);
    this.scene.add(this.camera);

    const grid = new GridHelper(10, 5, 0xFFFF00, 0xFFFF00);
    grid.position.y = 0;
    this.scene.add(grid);

    this.geometry = new BoxGeometry(1, 1);
    // this.geometry = new TorusGeometry(1, 0.2, 20, 20);
    this.material = new MeshNormalMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.scene2 = new Scene();
    this.camera2 = new OrthographicCamera(-this.renderSrv.renderWidth / 2, this.renderSrv.renderWidth / 2,
      this.renderSrv.renderHeight / 2, -this.renderSrv.renderHeight / 2, 0.1, 1000);
    this.scene2.add(this.camera2);

    this.overlayBox = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({wireframe: true}));
    this.scene2.add(this.overlayBox);
    this.camera2.position.set(0, 0, 10);
    this.camera2.lookAt(new Vector3());

    this.render();
  }

  private render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene2, this.camera2);
    // console.log(this.scene);
    // console.log(this.scene2);
  }

  private animate() {
    // requestAnimationFrame(() => this.animate());
    const time = (new Date().getTime() - this.startTime) / 1000;

    const speed = 0.6;
    const cameraRadius = 4;

    // Rotate camera:
    // camera.position.copy(
    //  new THREE.Vector3(Math.sin(time*speed), 0.5, Math.cos(time*speed)).multiplyScalar(cameraRadius)
    // );
    // camera.lookAt(new THREE.Vector3());
    // camera.rotation.x = Math.sin( time * 2.0 ) * 0.1 - 0.1;

    // Rotate mesh:
    // mesh.rotation.set(time, 0, 0);
    const boundingBox2D = this.computeScreenSpaceBoundingBox(this.mesh, this.camera);
    // 将标准化屏幕坐标系[-1,1]转换为像素坐标：
    const pixelCoordScale = this.normalizedToPixels(boundingBox2D.getSize(), this.renderSrv.renderWidth, this.renderSrv.renderHeight);
    const pixelCoordCenter = this.normalizedToPixels(boundingBox2D.getCenter(), this.renderSrv.renderWidth, this.renderSrv.renderHeight);
    console.log(pixelCoordScale);
    console.log(pixelCoordCenter);
    this.overlayBox.scale.set(pixelCoordScale.x, pixelCoordScale.y, 1);
    this.overlayBox.position.set(pixelCoordCenter.x, pixelCoordCenter.y, 0);
    // @ts-ignore
    this.overlayBox.needsUpdate = true;

    this.render();
  }

  computeScreenSpaceBoundingBox(mesh, camera) {
    console.log(mesh);
    const vertices = mesh.geometry.vertices;
    const vertex = new Vector3();
    const min = new Vector3(1, 1, 1);
    const max = new Vector3(-1, -1, -1);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < vertices.length; i++) {
      const vertexWorldCoord = vertex.copy(vertices[i]).applyMatrix4(mesh.matrixWorld);
      const vertexScreenSpace = vertexWorldCoord.project(camera);
      min.min(vertexScreenSpace);
      max.max(vertexScreenSpace);
    }
    // @ts-ignore
    return new Box2(min, max);
  }

  normalizedToPixels(coord, renderWidthPixels, renderHeightPixels) {
    const halfScreen = new Vector2(renderWidthPixels / 2, renderHeightPixels / 2);
    return coord.clone().multiply(halfScreen);
  }

  onMouseDown(event: MouseEvent) {
    console.log(event.clientX, event.clientY);
    console.log(this.scene2);
    this.animate();
  }
}
