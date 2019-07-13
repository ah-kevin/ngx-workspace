import { BoxGeometry, Mesh, MeshLambertMaterial, Texture } from 'three';

/**
 * 简易魔方
 * @param x 魔方中心点坐标x
 * @param y 魔方中心点坐标y
 * @param z 魔方中心点坐标z
 * @param num 魔方阶数
 * @param len 小方块宽高
 * @param colors 魔方六面体颜色
 */
export function SimpleCube(x, y, z, num, len, colors) {
  // 魔方左上角坐标
  const leftUpX = x - num / 2 * len;
  const leftUpY = y + num / 2 * len;
  const leftUpZ = z + num / 2 * len;
  // 根据颜色生成材质
  const materialArr = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < colors.length; i++) {
    const texture = new Texture(faces(colors[i]));
    texture.needsUpdate = true;
    const material = new MeshLambertMaterial({map: texture});
    materialArr.push(material);
  }
  const cubes = [];
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num * num; j++) {
      const cubegeo = new BoxGeometry(len, len, len);
      const cube = new Mesh(cubegeo, materialArr);
      // 依次计算各个小方块中心点坐标
      cube.position.x = (leftUpX + len / 2) + (j % num) * len;
      cube.position.y = (leftUpY - len / 2) - Math.floor(j / num) * len;
      cube.position.z = (leftUpZ - len / 2) - i * len;
      cubes.push(cube);
    }
  }
  return cubes;
}

// 生成canvas素材
function faces(rgbaColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    // 画一个宽高都是256的黑色正方形
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillRect(0, 0, 256, 256);
    // 在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
    context.rect(16, 16, 224, 224);
    context.lineJoin = 'round';
    context.lineWidth = 16;
    context.fillStyle = rgbaColor;
    context.strokeStyle = rgbaColor;
    context.stroke();
    context.fill();
  } else {
    alert('您的浏览器不支持Canvas无法预览.\n');
  }
  return canvas;
}
