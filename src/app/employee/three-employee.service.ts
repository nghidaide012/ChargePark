import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';


@Injectable({
  providedIn: 'root'
})
export class ThreeEmployeeService {
  private clickSpaceSubject = new Subject<{toggle: boolean, id: string}>();
  private clickedSpotupdate = new Subject<{id: string}>();

  public clickSpace$ = this.clickSpaceSubject.asObservable();
  public clickedSpotUpdate$ = this.clickedSpotupdate.asObservable();

  private socket$!: WebSocketSubject<any>;

  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  parkingSpaceDetail: any[] = [];
  modelMap = new Map();

  sizes: { width: number; height: number;} = {width: window.innerWidth, height: innerHeight}

  constructor(private http: HttpClient) {
    this.socket$ = new WebSocketSubject('wss://ig.example.be:8444/ws/spot/');
    this.socket$.subscribe({
      next: (data) => {
        if(!data.ping){
        this.changeParkingSpaceColor(data.message)
        this.clickedSpotupdate.next({id: data.message})
      }
     },
      error: (error) => { console.error(error) },
      complete: () => { console.warn('completed!') }
    })
   }


    detectSpaceChange(id: string)
   {
     this.socket$.next({message: id})
   }

  handleClickSpace(toggle: boolean, id: string) {
    this.clickSpaceSubject.next({toggle: toggle, id: id});
  }

  changeParkingSpaceColor(id: string)
  {
    if(!id) return;
    this.http.get('https://ig.example.be:8444/api/spot/'+id+'/', {withCredentials:true}).toPromise().then((data: any) => {
      const object = (this.scene.getObjectByName(id) as THREE.Mesh);
      this.parkingSpaceDetail = this.parkingSpaceDetail.map((space) => {
        if(space.id === data.id) {
          return {...space, ...data};
        }
        return space;
      });
      const space = this.parkingSpaceDetail.find((space) => space.id === id);
      if (object && object.material) {
        if(space['is_parking'])
          {
            (object.material as THREE.MeshBasicMaterial).color.set(0xff0000);
          }
        else if(space['is_charge'])
          {
            (object.material as THREE.MeshBasicMaterial).color.set(0x7DF9FF);
          }
        else
          {
            (object.material as THREE.MeshBasicMaterial).color.set(0x00ff00);
          }
      }
    })

  }



  public importModel(models: any[] | any): void {

    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    this.sceneSetup()
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/three/examples/jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const parkingmaps: any[] = [];
    const parkingSpaces: any[] = [];

    this.cameraSetup()
    this.controlSetup(canvas)
    this.rendererSetup(canvas)


    if(Array.isArray(models))
      {
        models.forEach((model:any) => {
          gltfLoader.load(model.model_path.replace('http://app.example.be:8000', 'https://ig.example.be:8444'), (gltf) => {
            gltf.scene.scale.set(0.05, 0.05, 0.05)
            gltf.scene.name = model.id
            this.scene.add(gltf.scene);
            let [x, y, z] = model.position.split(',').map(Number);
            gltf.scene.position.set(x,y,z)
            parkingmaps.push(gltf.scene)
            gltf.scene.traverse((child:any) => {
              if (child.isMesh) {
                this.modelMap.set(child, gltf.scene);
              }
            });
          });
        })
      }
      else
      {
        gltfLoader.load(models.model_path.replace('http://app.example.be:8000', 'https://ig.example.be:8444'), (gltf) => {
          gltf.scene.scale.set(0.05, 0.05, 0.05)
          gltf.scene.name = models.id
          this.scene.add(gltf.scene);
          gltf.scene.position.set(0,0,0)
          parkingmaps.push(gltf.scene)
        });
      }
    if(!Array.isArray(models))
      {
        models['parking_spaces'].forEach((space: any) => {
          this.parkingSpaceDetail.push(space)
          let tempObject = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.01, 0.1),
            new THREE.MeshBasicMaterial()
        );
          tempObject.position.set(space.position.split(',').map(Number)[0], space.position.split(',').map(Number)[1], space.position.split(',').map(Number)[2])
          tempObject.rotation.y = space.direction
          tempObject.name = space.id
          if(space['is_parking'])
            {
              tempObject.material.color.set(0xff0000)
            }
          else if(space['is_charge'])
            {
              tempObject.material.color.set(0x7DF9FF)
            }
          else
            {
              tempObject.material.color.set(0x00ff00)
            }

          this.scene.add(tempObject)
          parkingSpaces.push(tempObject)
        })
        this.interactionSetup(parkingSpaces, false)

      }
      else
      {
        this.interactionSetup(parkingmaps, true)
      }



    window.addEventListener('resize', () =>
      {
          this.sizes.width = window.innerWidth
          this.sizes.height = window.innerHeight
          // Update camera
          this.camera.aspect = this.sizes.width /this.sizes.height
          this.camera.updateProjectionMatrix()

          // Update renderer
          this.renderer.setSize(this.sizes.width, this.sizes.height)
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      })

    const clock = new THREE.Clock()
    let previousTime = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      window.requestAnimationFrame(tick)
    }
    tick()

  }

  interactionSetup(interactList: any[], isMap: boolean) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mousemove = false;
    let mouseDown = false;
    let lastIntersected:any;

    window.addEventListener('mouseup', (event) => {
      mouseDown = false;
    });

    window.addEventListener('mousedown', (event) => {
      mouseDown = true;
      mousemove = false;

    });

    window.addEventListener('click', (event) => {
      if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement ) return;
      let targetElement: Node | null = event.target as Node;

      do {
        if (targetElement instanceof HTMLElement && targetElement.classList.contains('no-click-event')) {
          event.stopPropagation();
          return;
        }
        targetElement = targetElement?.parentNode || null;
      } while (targetElement);
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);
      if(isMap)
        {
          const intersects = raycaster.intersectObjects(interactList);
          if (intersects.length > 0 && !mousemove) {
            const object = intersects[0].object as THREE.Mesh;
            const entireModel = this.modelMap.get(object);
            location.href = '/parkinglot/'+entireModel.name;
          }
        }
        else
        {
          const intersects = raycaster.intersectObjects(interactList);
          if (intersects.length > 0 && !mousemove) {
            this.handleClickSpace(true, intersects[0].object.name);
            this.camera.position.set(intersects[0].object.position.x, 1, intersects[0].object.position.z)
            this.controls.target.set(intersects[0].object.position.x, 0, intersects[0].object.position.z)
          }
          else if(!mousemove)
          {
            this.handleClickSpace(false, '');
            this.controls.target.set(0, 0, 0)
            this.camera.position.set(0, 2, -3)
          }
        }
    });

    window.addEventListener('mousemove', (event) => {
      mousemove = true;
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);
      if(isMap)
        {
          const intersects = raycaster.intersectObjects(interactList);

          if (lastIntersected) {
            lastIntersected.traverse((child: any) => {
              if (child.isMesh && child.material.color) {
                child.material.color.set(child.userData.originalColor);
              }
            });
            lastIntersected = null;
          }

          if (intersects.length > 0) {
            const object = intersects[0].object as THREE.Mesh;
            const entireModel = this.modelMap.get(object);

            if(entireModel)
              {
                entireModel.traverse((child: any) => {
                  if (child.isMesh) {
                    child.userData.originalColor = child.material.color.getHex();
                    child.material.color.set(0x94c1c2);
                  }
                });

                lastIntersected = entireModel;
              }
          }
        }


    });
  }




  rendererSetup(canvas: any)
  {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  cameraSetup()
  {
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.set(0,1,-3)
    this.scene.add(this.camera)
  }
  controlSetup(canvas: any)
  {
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.target.set(0, 0, 0)
    this.controls.enableZoom = false
  }
  sceneSetup()
  {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xfefefd, 5, 15)
    const envMap = new THREE.CubeTextureLoader().load([
      '/assets/envmap/px.png',
      '/assets/envmap/nx.png',
      '/assets/envmap/py.png',
      '/assets/envmap/ny.png',
      '/assets/envmap/pz.png',
      '/assets/envmap/nz.png',
    ])
   this.scene.background = envMap
    this.scene.environment = envMap
    this.scene.backgroundIntensity = 1.05
  }


}
