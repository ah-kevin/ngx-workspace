import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RendererService } from 'src/app/services/renderer.service';
import { WebGLRenderer, PerspectiveCamera, Vector3, Scene, AmbientLight, Geometry, LineBasicMaterial, Line } from 'three';
import { SimpleCube } from '../../utils/rubiksCube';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.less']
})
export class StageComponent implements OnInit, AfterViewInit {
  renderer: WebGLRenderer;
  @ViewChild('container', {static: false}) container: ElementRef;
  element: HTMLElement;
  private camera: PerspectiveCamera;
  private scene: Scene;
  // 魔方参数
  cubeParams = {
    x: 0,
    y: 0,
    z: 0,
    num: 3,
    len: 50,
    colors: ['rgba(255,193,37,1)', 'rgba(0,191,255,1)',
      'rgba(50,205,50,1)', 'rgba(178,34,34,1)',
      'rgba(255,255,0,1)', 'rgba(255,255,255,1)']
  };

  constructor(private renderSrv: RendererService) {
    this.renderer = this.renderSrv.getRenderer();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.element = this.container.nativeElement;
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.renderer.setClearColor(0xFFFFFF, 1.0);
    this.container.nativeElement.appendChild(this.renderer.domElement);
    this.init();
    // this.animate();
  }

  init() {
    this.initCamera();
    this.initScene();
    this.initLight();
    this.initObject();
    this.render();
  }

  private render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    // console.log(this.scene);
    // console.log(this.scene2);
    requestAnimationFrame(() => this.render());
  }

  private animate() {

  }

  // 创建相机，并设置正方向和中心点
  private initCamera() {
    this.camera = new PerspectiveCamera(45, this.element.clientWidth / this.element.clientHeight, 1, 1000);
    this.camera.position.set(0, 0, 600);
    this.camera.up.set(0, 1, 0); // 正方向
    this.camera.lookAt(new Vector3());
    // 视角控制
    const controller = new OrbitControls(this.camera, this.renderer.domElement);
    controller.target = new Vector3(); // 设置控制点
  }

  // 创建场景，后续元素需要加入到场景中才会显示出来
  private initScene() {
    this.scene = new Scene();
  }

  private initLight() {
    const ambientLight = new AmbientLight(0xfefefe);
    this.scene.add(ambientLight);
  }

  private initObject() {
    // this.initLine();
    // 生成魔方小正方体
    const cubes = SimpleCube(this.cubeParams.x, this.cubeParams.y, this.cubeParams.z, this.cubeParams.num, this.cubeParams.len, this.cubeParams.colors);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < cubes.length; i++) {
      const item = cubes[i];
      this.scene.add(cubes[i]); //  并依次加入到场景中
    }
  }

  private initLine() {
    // 坐标轴
    const xmat = new LineBasicMaterial({color: 0xff0000});
    const xgeo = new Geometry();
    xgeo.vertices.push(
      new Vector3(0, 0, 0),
      new Vector3(300, 0, 0)
    );
    const xline = new Line(xgeo, xmat);
    this.scene.add(xline);

    const ymat = new LineBasicMaterial({color: 0x00ff00});
    const ygeo = new Geometry();
    ygeo.vertices.push(
      new Vector3(0, 0, 0),
      new Vector3(0, 300, 0)
    );
    const yline = new Line(ygeo, ymat);
    this.scene.add(yline);

    const zmat = new LineBasicMaterial({color: 0x0000ff});
    const zgeo = new Geometry();
    zgeo.vertices.push(
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 300)
    );
    const zline = new Line(zgeo, zmat);
    this.scene.add(zline);
  }
}
